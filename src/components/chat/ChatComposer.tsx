import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  embedded?: boolean;
}

export function ChatComposer({ value, onChange, onSend, textareaRef, embedded = false }: Props) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = textareaRef ?? localRef;
  const composing = useRef(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [value, ref]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (composing.current || event.nativeEvent.isComposing) return;
    const desktopKeyboard = window.matchMedia("(pointer: fine)").matches;
    if (desktopKeyboard && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className={embedded ? "w-full" : "border-t border-slate-200 bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-4"}>
      <div className="mx-auto w-full max-w-[860px]">
        <div className="flex items-end gap-1.5 rounded-[24px] border border-slate-300 bg-white p-2 shadow-[0_10px_35px_rgba(15,23,42,0.10)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 sm:gap-2">
          <button type="button" onClick={() => setNotice("Attachments will be available after JOJO integration.")} className="composer-button" aria-label="Attach a document"><Paperclip size={20} /></button>
          <textarea
            ref={ref}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => { composing.current = true; }}
            onCompositionEnd={() => { composing.current = false; }}
            rows={1}
            inputMode="text"
            enterKeyHint="enter"
            className="min-h-11 max-h-32 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2.5 text-base leading-6 text-slate-800 outline-none placeholder:text-slate-400 sm:px-2"
            placeholder="ถามเกี่ยวกับ SOP, WI, Material Code, NG History..."
            aria-label="Ask IQC AI"
          />
          <button type="button" onClick={() => setNotice("Voice input is not available in Version 1.")} className="composer-button" aria-label="Use microphone"><Mic size={20} /></button>
          <button type="button" onClick={onSend} disabled={!value.trim()} className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400" aria-label="Send message"><ArrowUp size={20} strokeWidth={2.4} /></button>
        </div>
        <div className="min-h-5 pt-1.5 text-center text-[10px] text-slate-400" aria-live="polite">{notice || (embedded ? "Company AI: Not Connected" : "Desktop: Enter to send · Shift + Enter for new line")}</div>
      </div>
    </div>
  );
}
