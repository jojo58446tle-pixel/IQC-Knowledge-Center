interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

interface ReferenceSource {
  id: string;
  index: number;
  name: string;
  type: number;
  docName?: string;
  url?: string;
}

interface ChatResponse {
  success: boolean;
  conversationId: string;
  answer: string;
  references: ReferenceSource[];
  error?: string;
}

interface SSEEvent {
  event: string;
  data: string;
}

type JsonRecord = Record<string, unknown>;

const ADP_CHAT_URL = "https://agent.sungrow.cn/v1/qbot/chat/sse";
const ADP_TIMEOUT_MS = 50_000;

/**
 * Streaming-safe SSE parser.
 * Network chunks may contain partial SSE events,
 * so we buffer until a blank line is received.
 */
class SSEBuffer {
  private buffer = "";
  private events: SSEEvent[] = [];

  append(chunk: string): void {
    this.buffer += chunk
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    let boundary = this.buffer.indexOf("\n\n");

    while (boundary !== -1) {
      const block = this.buffer.slice(0, boundary);
      this.buffer = this.buffer.slice(boundary + 2);

      this.parseBlock(block);

      boundary = this.buffer.indexOf("\n\n");
    }
  }

  flush(): void {
    const block = this.buffer.trim();
    this.buffer = "";

    if (block) {
      this.parseBlock(block);
    }
  }

  private parseBlock(block: string): void {
    if (!block || block.startsWith(":")) {
      return;
    }

    let event = "message";
    const dataLines: string[] = [];

    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const value = line.slice(5);
        dataLines.push(
          value.startsWith(" ")
            ? value.slice(1)
            : value
        );
      }
    }

    if (dataLines.length > 0) {
      this.events.push({
        event,
        data: dataLines.join("\n"),
      });
    }
  }

  getEvents(): SSEEvent[] {
    const result = this.events;
    this.events = [];
    return result;
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(
  object: JsonRecord,
  key: string
): string | undefined {
  const value = object[key];

  return typeof value === "string"
    ? value
    : undefined;
}

/**
 * Extract answer text from several possible ADP response formats.
 *
 * Because the exact JOJO SSE response event schema has not yet
 * been confirmed, this supports common formats such as:
 *
 * { answer: "..." }
 * { content: "..." }
 * { text: "..." }
 * { data: { answer: "..." } }
 * { message: { content: "..." } }
 */
function extractText(
  value: unknown,
  depth = 0
): string | undefined {
  if (depth > 4 || !isRecord(value)) {
    return undefined;
  }

  const directKeys = [
    "answer",
    "content",
    "text",
    "output",
    "reply",
    "delta",
  ];

  for (const key of directKeys) {
    const result = getString(value, key);

    if (result) {
      return result;
    }
  }

  const nestedKeys = [
    "data",
    "message",
    "result",
    "response",
    "payload",
  ];

  for (const key of nestedKeys) {
    const nested = value[key];

    if (nested !== undefined) {
      const result = extractText(
        nested,
        depth + 1
      );

      if (result) {
        return result;
      }
    }
  }

  return undefined;
}

/**
 * Adds streaming text while avoiding obvious duplication
 * if the server sometimes sends cumulative text.
 */
function mergeAnswer(
  current: string,
  incoming: string
): string {
  if (!incoming) {
    return current;
  }

  if (!current) {
    return incoming;
  }

  if (incoming === current) {
    return current;
  }

  // Server sent full cumulative response.
  if (incoming.startsWith(current)) {
    return incoming;
  }

  // Duplicate chunk.
  if (current.endsWith(incoming)) {
    return current;
  }

  return current + incoming;
}

function getEventName(
  evt: SSEEvent,
  payload: JsonRecord
): string {
  const payloadEvent = getString(
    payload,
    "event"
  );

  return (
    payloadEvent ||
    evt.event ||
    "message"
  ).toLowerCase();
}

function getErrorInfo(
  payload: JsonRecord
): {
  code?: string | number;
  message?: string;
} {
  let code: string | number | undefined;
  let message: string | undefined;

  const directCode = payload.code;

  if (
    typeof directCode === "string" ||
    typeof directCode === "number"
  ) {
    code = directCode;
  }

  message =
    getString(payload, "message") ||
    getString(payload, "error_message") ||
    getString(payload, "msg");

  const errorObject = payload.error;

  if (isRecord(errorObject)) {
    const nestedCode =
      errorObject.code;

    if (
      typeof nestedCode === "string" ||
      typeof nestedCode === "number"
    ) {
      code = nestedCode;
    }

    message =
      getString(errorObject, "message") ||
      getString(errorObject, "msg") ||
      message;
  }

  return {
    code,
    message,
  };
}

function normalizeReference(
  item: unknown,
  index: number
): ReferenceSource | undefined {
  if (!isRecord(item)) {
    return undefined;
  }

  const id =
    getString(item, "id") ||
    getString(item, "document_id") ||
    getString(item, "doc_id") ||
    `ref-${index}`;

  const name =
    getString(item, "name") ||
    getString(item, "title") ||
    getString(item, "document_name") ||
    getString(item, "doc_name") ||
    `Reference ${index}`;

  const docName =
    getString(item, "document_name") ||
    getString(item, "doc_name");

  const url =
    getString(item, "url") ||
    getString(item, "source_url");

  return {
    id,
    index,
    name,
    type: 0,
    docName,
    url,
  };
}

function collectReferences(
  payload: JsonRecord,
  referenceMap: Map<string, ReferenceSource>
): void {
  const candidateArrays: unknown[] = [];

  const directKeys = [
    "references",
    "sources",
    "documents",
    "retriever_resources",
  ];

  for (const key of directKeys) {
    if (Array.isArray(payload[key])) {
      candidateArrays.push(
        payload[key]
      );
    }
  }

  const metadata = payload.metadata;

  if (isRecord(metadata)) {
    for (const key of directKeys) {
      if (
        Array.isArray(metadata[key])
      ) {
        candidateArrays.push(
          metadata[key]
        );
      }
    }
  }

  for (const candidate of candidateArrays) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    candidate.forEach(
      (item, itemIndex) => {
        const ref =
          normalizeReference(
            item,
            itemIndex + 1
          );

        if (ref) {
          referenceMap.set(
            ref.id,
            ref
          );
        }
      }
    );
  }
}

function parseNonStreamingResponse(
  raw: string,
  conversationId: string
): ChatResponse {
  let payload: unknown;

  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(
      "ADP API returned invalid JSON"
    );
  }

  if (!isRecord(payload)) {
    throw new Error(
      "ADP API returned invalid response"
    );
  }

  const errorInfo =
    getErrorInfo(payload);

  if (
    errorInfo.code &&
    errorInfo.code !== 0 &&
    errorInfo.code !== "0"
  ) {
    throw new Error(
      `ADP error ${errorInfo.code}: ${
        errorInfo.message ||
        "Unknown error"
      }`
    );
  }

  const answer =
    extractText(payload)?.trim();

  if (!answer) {
    console.error(
      "ADP empty JSON response",
      JSON.stringify(payload).slice(
        0,
        2000
      )
    );

    throw new Error(
      "ADP API returned an empty answer"
    );
  }

  const referenceMap =
    new Map<
      string,
      ReferenceSource
    >();

  collectReferences(
    payload,
    referenceMap
  );

  return {
    success: true,
    conversationId,
    answer,
    references: [
      ...referenceMap.values(),
    ],
  };
}

async function callADPAPI(
  message: string,
  conversationId: string,
  appKey: string
): Promise<ChatResponse> {
  /**
   * JOJO / Sungrow ADP request format.
   *
   * IMPORTANT:
   * AppKey is sent as bot_app_key in the JSON body.
   * It is NOT sent as Authorization header.
   */
  const requestBody = {
    session_id: conversationId,

    bot_app_key: appKey,

    content: message,

    incremental: true,

    streaming_throttle: 10,

    visitor_labels: [],

    custom_variables: {},

    stream: "enable",

    workflow_status: "disable",

    tcadp_user_id: "",
  };

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    ADP_TIMEOUT_MS
  );

  try {
    console.log(
      "Calling JOJO ADP API",
      {
        endpoint: ADP_CHAT_URL,
        sessionId:
          conversationId,
        messageLength:
          message.length,
        appKeyConfigured:
          Boolean(appKey),
      }
    );

    const response =
      await fetch(
        ADP_CHAT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "text/event-stream, application/json",
          },

          body: JSON.stringify(
            requestBody
          ),

          signal:
            controller.signal,
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    console.log(
      "JOJO ADP response",
      {
        status:
          response.status,
        contentType,
      }
    );

    if (!response.ok) {
      const detail =
        await response
          .text()
          .catch(() => "");

      console.error(
        "JOJO ADP HTTP error",
        response.status,
        detail.slice(0, 2000)
      );

      throw new Error(
        `ADP API returned HTTP ${response.status}`
      );
    }

    /**
     * Some ADP configurations may return
     * normal JSON even though the endpoint
     * contains /sse.
     */
    if (
      !contentType.includes(
        "text/event-stream"
      )
    ) {
      const raw =
        await response.text();

      console.log(
        "JOJO non-SSE response received"
      );

      return parseNonStreamingResponse(
        raw,
        conversationId
      );
    }

    if (!response.body) {
      throw new Error(
        "ADP API returned no response body"
      );
    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder(
        "utf-8"
      );

    const sse =
      new SSEBuffer();

    let answer = "";

    let completed =
      false;

    const referenceMap =
      new Map<
        string,
        ReferenceSource
      >();

    const processEvent = (
      evt: SSEEvent
    ): void => {
      if (
        evt.data.trim() ===
        "[DONE]"
      ) {
        completed = true;
        return;
      }

      let payload:
        JsonRecord;

      try {
        const parsed =
          JSON.parse(
            evt.data
          ) as unknown;

        if (
          !isRecord(parsed)
        ) {
          return;
        }

        payload =
          parsed;
      } catch (error) {
        console.warn(
          "Ignoring invalid JOJO SSE JSON",
          {
            event:
              evt.event,
            data:
              evt.data.slice(
                0,
                500
              ),
          }
        );

        return;
      }

      const eventName =
        getEventName(
          evt,
          payload
        );

      /**
       * Do not log the complete payload here.
       * It may contain company knowledge content.
       */
      console.log(
        "JOJO SSE event:",
        eventName
      );

      const errorInfo =
        getErrorInfo(
          payload
        );

      const isErrorEvent =
        eventName.includes(
          "error"
        );

      const hasErrorCode =
        errorInfo.code !==
          undefined &&
        errorInfo.code !==
          0 &&
        errorInfo.code !==
          "0";

      if (
        isErrorEvent ||
        hasErrorCode
      ) {
        console.error(
          "JOJO ADP error event",
          {
            event:
              eventName,
            code:
              errorInfo.code,
            message:
              errorInfo.message,
          }
        );

        throw new Error(
          `ADP error${
            errorInfo.code
              ? ` ${errorInfo.code}`
              : ""
          }: ${
            errorInfo.message ||
            "Unknown ADP error"
          }`
        );
      }

      collectReferences(
        payload,
        referenceMap
      );

      const text =
        extractText(
          payload
        );

      if (text) {
        answer =
          mergeAnswer(
            answer,
            text
          );
      }

      /**
       * Common completion event names.
       */
      if (
        eventName.includes(
          "completed"
        ) ||
        eventName.includes(
          "message_end"
        ) ||
        eventName.includes(
          "message.end"
        ) ||
        eventName === "done" ||
        eventName ===
          "finish" ||
        eventName ===
          "finished"
      ) {
        completed = true;
      }

      if (
        payload.done ===
        true
      ) {
        completed = true;
      }
    };

    try {
      while (!completed) {
        const {
          done,
          value,
        } =
          await reader.read();

        if (done) {
          break;
        }

        sse.append(
          decoder.decode(
            value,
            {
              stream: true,
            }
          )
        );

        for (
          const evt of
          sse.getEvents()
        ) {
          processEvent(
            evt
          );
        }
      }

      sse.append(
        decoder.decode()
      );

      sse.flush();

      for (
        const evt of
        sse.getEvents()
      ) {
        processEvent(evt);
      }
    } catch (error) {
      try {
        await reader.cancel();
      } catch {
        // Ignore cancellation errors.
      }

      throw error;
    }

    answer =
      answer.trim();

    if (!answer) {
      throw new Error(
        "ADP API returned an empty answer"
      );
    }

    return {
      success: true,

      conversationId,

      answer,

      references: [
        ...referenceMap.values(),
      ],
    };
  } catch (error) {
    if (
      controller.signal.aborted
    ) {
      throw new Error(
        "ADP API request timed out"
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getConversationId(
  body: Record<
    string,
    unknown
  >
): string {
  const value =
    body.conversationId;

  if (
    typeof value ===
      "string" &&
    /^[a-zA-Z0-9_-]{1,128}$/.test(
      value
    )
  ) {
    return value;
  }

  return crypto.randomUUID();
}

export const handler =
  async (
    event: NetlifyEvent
  ) => {
    const jsonHeaders = {
      "Content-Type":
        "application/json; charset=utf-8",
    };

    if (
      event.httpMethod !==
      "POST"
    ) {
      return {
        statusCode: 405,

        headers: {
          ...jsonHeaders,
          Allow: "POST",
        },

        body: JSON.stringify({
          success: false,
          error:
            "Method not allowed",
        }),
      };
    }

    /**
     * Keep the existing Netlify environment variable:
     *
     * JOJO_APP_KEY
     */
    const appKey =
      process.env
        .JOJO_APP_KEY
        ?.trim();

    if (!appKey) {
      console.error(
        "JOJO_APP_KEY environment variable is not set"
      );

      return {
        statusCode: 500,

        headers:
          jsonHeaders,

        body: JSON.stringify(
          {
            success: false,

            error:
              "AI service is not configured. Please contact administrator.",
          }
        ),
      };
    }

    let body: Record<
      string,
      unknown
    >;

    try {
      body = JSON.parse(
        event.body ||
          "{}"
      ) as Record<
        string,
        unknown
      >;
    } catch {
      return {
        statusCode: 400,

        headers:
          jsonHeaders,

        body: JSON.stringify(
          {
            success: false,
            error:
              "Invalid request body",
          }
        ),
      };
    }

    const message =
      body.message;

    if (
      typeof message !==
        "string" ||
      !message.trim()
    ) {
      return {
        statusCode: 400,

        headers:
          jsonHeaders,

        body: JSON.stringify(
          {
            success: false,
            error:
              "Message is required",
          }
        ),
      };
    }

    if (
      message.length >
      20_000
    ) {
      return {
        statusCode: 413,

        headers:
          jsonHeaders,

        body: JSON.stringify(
          {
            success: false,
            error:
              "Message is too long",
          }
        ),
      };
    }

    const conversationId =
      getConversationId(
        body
      );

    try {
      const result =
        await callADPAPI(
          message.trim(),
          conversationId,
          appKey
        );

      return {
        statusCode: 200,

        headers:
          jsonHeaders,

        body: JSON.stringify(
          result
        ),
      };
    } catch (error) {
      console.error(
        "JOJO ADP API call failed",
        error
      );

      return {
        statusCode: 502,

        headers:
          jsonHeaders,

        body: JSON.stringify(
          {
            success: false,

            conversationId,

            answer: "",

            references: [],

            error:
              "ไม่สามารถเชื่อมต่อ Company AI ได้ กรุณาลองใหม่อีกครั้ง",
          }
        ),
      };
    }
  };
