import { Unplug } from "lucide-react";

export function ConnectionStatus({ compact = false }: { compact?: boolean }) {
  if (compact) return <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-500 sm:text-xs"><span className="size-1.5 rounded-full bg-slate-400" />AI Not Connected</span>;
  return <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"><Unplug size={14} />Company AI: Not Connected</span>;
}
