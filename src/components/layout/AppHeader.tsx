import { CircleUserRound, Menu } from "lucide-react";
import { ConnectionStatus } from "./ConnectionStatus";

interface AppHeaderProps { onOpenDrawer: () => void }

export function AppHeader({ onOpenDrawer }: AppHeaderProps) {
  return (
    <header className="z-30 flex min-h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 py-2 sm:min-h-[72px] sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <button type="button" onClick={onOpenDrawer} className="icon-button size-11 rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Open navigation"><Menu size={21} /></button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold tracking-tight text-slate-950 sm:text-lg">IQC Knowledge Center</h1>
          <div className="mt-0.5 flex min-w-0 items-center gap-2"><p className="truncate text-[10px] text-slate-500 sm:text-xs">Powered by JOJO • Company AI</p><ConnectionStatus compact /></div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700"><CircleUserRound size={22} aria-hidden="true" /></span>
        <div className="hidden sm:block"><p className="text-xs font-semibold text-slate-800">IQC Team</p><p className="mt-0.5 text-[11px] text-slate-500">Internal corporate access</p></div>
      </div>
    </header>
  );
}
