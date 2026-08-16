import { Bot, CircleAlert, FileQuestion, LoaderCircle, SearchX, Unplug } from "lucide-react";
import type { ChatState } from "@/types";

const stateConfig: Record<ChatState, { title: string; description: string; icon: typeof Bot; className: string }> = {
  thinking: { title: "AI Thinking...", description: "Searching connected company knowledge.", icon: LoaderCircle, className: "text-blue-600" },
  "connection-error": { title: "Connection Error", description: "The Company AI service could not be reached.", icon: CircleAlert, className: "text-rose-600" },
  "no-knowledge": { title: "No Knowledge Found", description: "No matching knowledge was found for this question.", icon: SearchX, className: "text-slate-500" },
  "no-reference": { title: "No Reference Found", description: "An answer is available, but it has no linked reference source.", icon: FileQuestion, className: "text-amber-600" },
  "not-connected": { title: "AI Not Connected", description: "Company AI connection is not configured yet.", icon: Unplug, className: "text-slate-500" },
};

export function ChatStateMessage({ state }: { state: ChatState }) {
  const config = stateConfig[state];
  const Icon = config.icon;
  return (
    <div className="flex max-w-2xl items-start gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white"><Bot size={17} /></div>
      <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2"><Icon size={17} className={`${config.className} ${state === "thinking" ? "animate-spin" : ""}`} /><p className="text-sm font-semibold text-slate-800">{config.title}</p></div>
        <p className="mt-1 text-sm leading-6 text-slate-500">{config.description}</p>
      </div>
    </div>
  );
}
