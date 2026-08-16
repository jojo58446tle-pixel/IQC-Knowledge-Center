import { useEffect, useRef, useState } from "react";
import { AIAnswer } from "@/components/chat/AIAnswer";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatStateMessage } from "@/components/chat/ChatStateMessage";
import { sendMessage } from "@/services/aiService";
import type { ChatMessage } from "@/types";

export function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.length > 0;

  useEffect(() => { if (hasConversation) endRef.current?.scrollIntoView({ block: "end" }); }, [messages, hasConversation]);

  const chooseQuestion = (value: string) => {
    setInput(value);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text: message }]);
    setInput("");
    const response = await sendMessage(message);
    if (!response.configured) {
      setMessages((current) => [...current, { id: `state-${Date.now()}`, role: "state", state: "not-connected" }]);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {!hasConversation ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center py-8">
            <ChatEmptyState onQuestion={chooseQuestion} />
            <div className="mx-auto mt-10 w-full max-w-[860px] sm:mt-14"><ChatComposer value={input} onChange={setInput} onSend={handleSend} textareaRef={textareaRef} embedded /></div>
          </div>
        </div>
      ) : <>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <section className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8" aria-label="Chat conversation">
            {messages.map((message) => {
              if (message.role === "user") return <div key={message.id} className="flex justify-end"><div className="max-w-[80%] rounded-2xl rounded-tr-md bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-800 ring-1 ring-blue-100">{message.text}</div></div>;
              if (message.role === "assistant" && message.answer) return <AIAnswer key={message.id} answer={message.answer} />;
              if (message.role === "state" && message.state) return <ChatStateMessage key={message.id} state={message.state} />;
              return null;
            })}
            <div ref={endRef} />
          </section>
        </div>
        <ChatComposer value={input} onChange={setInput} onSend={handleSend} textareaRef={textareaRef} />
      </>}
    </div>
  );
}
