interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

interface NetlifyContext {
  clientContext?: {
    identity?: {
      sub?: string;
    };
  };
}

interface ADPReference {
  Index: number;
  Name: string;
  Type: number;
  DocRefer?: {
    DocId?: string;
    DocName?: string;
    KnowledgeId?: string;
    Url?: string;
  };
  QaRefer?: {
    QaId?: string;
    Question?: string;
  };
  WebSearchRefer?: {
    Url?: string;
    Title?: string;
  };
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

interface ADPEventPayload {
  Type?: string;
  MessageId?: string;
  ContentIndex?: number;
  Text?: string;
  Message?: {
    Type?: string;
    MessageId?: string;
    Contents?: Array<{ Type?: string; Text?: string }>;
  };
  Reference?: ADPReference;
  Response?: {
    Status?: string;
    StatusDesc?: string;
    Messages?: Array<{
      Type?: string;
      MessageId?: string;
      Contents?: Array<{ Type?: string; Text?: string }>;
    }>;
  };
  Error?: {
    Code?: number;
    Message?: string;
    RequestId?: string;
    TraceId?: string;
  };
}

const ADP_CHAT_URL = "https://wss.lke.tencentcloud.com/adp/v2/chat";
const ADP_TIMEOUT_MS = 50_000;

/**
 * Streaming-safe SSE parser. Network chunks do not necessarily align with
 * event boundaries, so partial data is buffered until a blank line is seen.
 */
class SSEBuffer {
  private buffer = "";
  private events: SSEEvent[] = [];

  append(chunk: string): void {
    this.buffer += chunk.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

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
    if (block) this.parseBlock(block);
  }

  private parseBlock(block: string): void {
    if (!block || block.startsWith(":")) return;

    let event = "message";
    const dataLines: string[] = [];

    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const value = line.slice(5);
        dataLines.push(value.startsWith(" ") ? value.slice(1) : value);
      }
    }

    if (dataLines.length > 0) {
      this.events.push({ event, data: dataLines.join("\n") });
    }
  }

  getEvents(): SSEEvent[] {
    const result = this.events;
    this.events = [];
    return result;
  }
}

function normalizeReference(ref: ADPReference): ReferenceSource {
  return {
    id: `ref-${ref.Index}`,
    index: ref.Index,
    name: ref.Name || ref.DocRefer?.DocName || ref.WebSearchRefer?.Title || `Reference ${ref.Index}`,
    type: ref.Type,
    docName: ref.DocRefer?.DocName,
    url: ref.DocRefer?.Url || ref.WebSearchRefer?.Url,
  };
}

function collectFinalReply(payload: ADPEventPayload): string | undefined {
  const reply = payload.Response?.Messages?.find((message) => message.Type === "reply");
  if (!reply?.Contents) return undefined;

  const text = reply.Contents
    .filter((content) => content.Type === "text" && typeof content.Text === "string")
    .map((content) => content.Text || "")
    .join("");

  return text || undefined;
}

async function callADPAPI(
  message: string,
  conversationId: string,
  visitorId: string,
  appKey: string
): Promise<ChatResponse> {
  const requestBody = {
    RequestId: crypto.randomUUID(),
    ConversationId: conversationId,
    AppKey: appKey,
    Contents: [{ Type: "text", Text: message }],
    VisitorId: visitorId,
    Incremental: true,
    EnableMultiIntent: true,
    Stream: "enable",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ADP_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(ADP_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("ADP HTTP error", response.status, detail.slice(0, 500));
    throw new Error(`ADP API returned status ${response.status}`);
  }

  if (!response.body) throw new Error("ADP API returned no body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  const sse = new SSEBuffer();

  const replyMessageIds = new Set<string>();
  const textByContentIndex = new Map<number, string>();
  const referenceMap = new Map<number, ReferenceSource>();
  let finalAnswer: string | undefined;
  let completed = false;

  const processEvent = (evt: SSEEvent): void => {
    let payload: ADPEventPayload;
    try {
      payload = JSON.parse(evt.data) as ADPEventPayload;
    } catch (error) {
      console.warn("Ignoring invalid SSE JSON", evt.event, error);
      return;
    }

    if (evt.event === "message.added" && payload.Message?.Type === "reply" && payload.Message.MessageId) {
      replyMessageIds.add(payload.Message.MessageId);
      return;
    }

    if (evt.event === "text.delta") {
      if (payload.MessageId && replyMessageIds.has(payload.MessageId) && typeof payload.Text === "string") {
        const index = payload.ContentIndex ?? 0;
        textByContentIndex.set(index, (textByContentIndex.get(index) || "") + payload.Text);
      }
      return;
    }

    if (evt.event === "text.replace") {
      if (payload.MessageId && replyMessageIds.has(payload.MessageId) && typeof payload.Text === "string") {
        const index = payload.ContentIndex ?? 0;
        textByContentIndex.set(index, payload.Text);
      }
      return;
    }

    if (evt.event === "message.done" && payload.Message?.Type === "reply") {
      if (payload.Message.MessageId) replyMessageIds.add(payload.Message.MessageId);
      const completeText = payload.Message.Contents
        ?.filter((content) => content.Type === "text" && typeof content.Text === "string")
        .map((content) => content.Text || "")
        .join("");
      if (completeText) finalAnswer = completeText;
      return;
    }

    if (evt.event === "reference.added" && payload.Reference) {
      const ref = normalizeReference(payload.Reference);
      referenceMap.set(ref.index, ref);
      return;
    }

    if (evt.event === "response.completed") {
      finalAnswer = collectFinalReply(payload) || finalAnswer;
      completed = true;
      return;
    }

    if (evt.event === "error") {
      const code = payload.Error?.Code;
      const messageText = payload.Error?.Message || "Unknown ADP error";
      console.error("ADP error event", { code, message: messageText, traceId: payload.Error?.TraceId });
      throw new Error(`ADP error${code ? ` ${code}` : ""}: ${messageText}`);
    }
  };

  try {
    while (!completed) {
      const { done, value } = await reader.read();
      if (done) break;

      sse.append(decoder.decode(value, { stream: true }));
      for (const evt of sse.getEvents()) processEvent(evt);
    }

    sse.append(decoder.decode());
    sse.flush();
    for (const evt of sse.getEvents()) processEvent(evt);
  } catch (error) {
    try {
      await reader.cancel();
    } catch {
      // Ignore cancellation errors.
    }
    throw error;
  }

  const streamedAnswer = [...textByContentIndex.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, text]) => text)
    .join("");
  const answer = (finalAnswer || streamedAnswer).trim();

  if (!answer) throw new Error("ADP API returned an empty answer");

  return {
    success: true,
    conversationId,
    answer,
    references: [...referenceMap.values()].sort((a, b) => a.index - b.index),
  };
}

function getConversationId(body: Record<string, unknown>): string {
  const value = body.conversationId;
  if (typeof value === "string" && /^[a-zA-Z0-9_-]{32,64}$/.test(value)) return value;
  return crypto.randomUUID();
}

function getVisitorId(body: Record<string, unknown>, context: NetlifyContext): string {
  const requested = body.visitorId;
  if (typeof requested === "string") {
    const cleaned = requested.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
    if (cleaned.length >= 1) return cleaned;
  }

  const identityId = context.clientContext?.identity?.sub;
  if (identityId) {
    const cleaned = identityId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
    if (cleaned) return cleaned;
  }

  return `anon_${crypto.randomUUID()}`;
}

export const handler = async (event: NetlifyEvent, context: NetlifyContext) => {
  const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...jsonHeaders, Allow: "POST" },
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  const appKey = process.env.JOJO_APP_KEY?.trim();
  if (!appKey) {
    console.error("JOJO_APP_KEY environment variable is not set");
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        error: "AI service is not configured. Please contact administrator.",
      }),
    };
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || "{}") as Record<string, unknown>;
  } catch {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ success: false, error: "Invalid request body" }),
    };
  }

  const message = body.message;
  if (typeof message !== "string" || !message.trim()) {
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({ success: false, error: "Message is required" }),
    };
  }

  if (message.length > 20_000) {
    return {
      statusCode: 413,
      headers: jsonHeaders,
      body: JSON.stringify({ success: false, error: "Message is too long" }),
    };
  }

  const conversationId = getConversationId(body);
  const visitorId = getVisitorId(body, context);

  try {
    const result = await callADPAPI(message.trim(), conversationId, visitorId, appKey);
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify(result) };
  } catch (error) {
    console.error("ADP API call failed", error);
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        conversationId,
        answer: "",
        references: [],
        error: "ไม่สามารถเชื่อมต่อ Company AI ได้ กรุณาลองใหม่อีกครั้ง",
      }),
    };
  }
};
