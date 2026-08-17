import type { ReferenceSource } from "@/types";

export interface ChatServiceResponse {
  success: boolean;
  conversationId: string;
  answer: string;
  references: ReferenceSource[];
  error?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

const VISITOR_ID_KEY = "iqc_jojo_visitor_id";

function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const visitorId = `visitor_${crypto.randomUUID()}`;
    window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch {
    return `visitor_${crypto.randomUUID()}`;
  }
}

/**
 * Send a message to JOJO through the same-origin Netlify Function.
 * The AppKey never reaches browser code.
 */
export async function sendMessage(request: ChatRequest): Promise<ChatServiceResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: request.message,
      conversationId: request.conversationId,
      visitorId: getVisitorId(),
    }),
  });

  let data: ChatServiceResponse | undefined;
  try {
    data = (await response.json()) as ChatServiceResponse;
  } catch {
    // handled below
  }

  if (!response.ok) {
    throw new Error(data?.error || `Chat API returned status ${response.status}`);
  }

  if (!data) throw new Error("Chat API returned an invalid response");
  return data;
}
