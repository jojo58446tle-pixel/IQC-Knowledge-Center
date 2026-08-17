import { useState, useRef, useEffect } from "react";
import { Bot, Send, RefreshCw, AlertCircle } from "lucide-react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { AIAnswer } from "@/components/chat/AIAnswer";
import { ReferenceSources } from "@/components/chat/ReferenceSources";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatStateMessage } from "@/components/chat/ChatStateMessage";
import { sendMessage } from "@/services/chatService";
import type { ChatMessage, ReferenceSource } from "@/types";
import { formatTime } from "@/utils/format";

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Clear input and error
    setInputValue("");
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        message,
        conversationId,
      });

      if (response.success) {
        // Update conversation ID for follow-up messages
        setConversationId(response.conversationId);

        // Add assistant message with answer
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: response.answer,
          answer: {
            text: [response.answer],
            references: response.references,
          },
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Handle API error
        setError(response.error || "เกิดข้อผิดพลาดในการตอบกลับ");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("ไม่สามารถเชื่อมต่อ Company AI ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(undefined);
    setError(null);
    setInputValue("");
    textareaRef.current?.focus();
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
      if (lastUserMessage?.text) {
        setInputValue(lastUserMessage.text);
        setMessages((prev) => prev.slice(0, -1));
      }
    }
  };

  const handleQuestion = (value: string) => {
    setInputValue(value);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <Bot size={18} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">IQC AI Assistant</h1>
            <p className="text-xs text-slate-500">ถามเกี่ยวกับ SOP, WI, Material Code, Monthly Report, NG History</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleNewConversation}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            title="Start new conversation"
          >
            <RefreshCw size={14} aria-hidden="true" />
            <span className="hidden sm:inline">New Conversation</span>
          </button>
        )}
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-[860px]">
          {messages.length === 0 && !error && <ChatEmptyState onQuestion={handleQuestion} />}

          {error && (
            <ChatStateMessage
              type="error"
              message={error}
              onRetry={handleRetry}
              icon={AlertCircle}
            />
          )}

          <div className="space-y-6">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                    <Bot size={17} aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-white shadow-sm"
                      : "min-w-0 flex-1"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm leading-6">{message.text}</p>
                  ) : message.role === "assistant" && message.answer ? (
                    <div>
                      <AIAnswer answer={message.answer} />
                      {message.answer.references && message.answer.references.length > 0 && (
                        <ReferenceSources sources={message.answer.references} />
                      )}
                    </div>
                  ) : null}

                  <p
                    className={`mt-2 text-xs ${
                      message.role === "user" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {formatTime(new Date())}
                  </p>
                </div>
              </article>
            ))}

            {isLoading && (
              <article className="flex gap-3">
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
                  <Bot size={17} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></span>
                      <span className="size-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></span>
                      <span className="size-2 animate-bounce rounded-full bg-blue-600"></span>
                    </div>
                    <span className="text-sm text-slate-600">JOJO กำลังคิด...</span>
                  </div>
                </div>
              </article>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Composer */}
      <footer className="shrink-0">
        <ChatComposer
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          textareaRef={textareaRef}
          disabled={isLoading}
        />
      </footer>
    </div>
  );
}
