import { FileText, History, Info, LogOut, MessageSquarePlus, Settings, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { PageKey } from "@/types";

const items = [
  { key: "documents", label: "Documents", icon: FileText },
  { key: "ng-history", label: "NG History", icon: History },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "about", label: "About", icon: Info },
] as const;

interface Props { open: boolean; currentPage: PageKey; onNavigate: (page: PageKey) => void; onNewConversation: () => void; onClose: () => void }

export function MobileDrawer({ open, currentPage, onNavigate, onNewConversation, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Main navigation">
      <button className="absolute inset-0 bg-slate-950/25" onClick={onClose} aria-label="Close navigation overlay" />
      <aside className="drawer-panel relative flex h-full w-[min(320px,calc(100vw-24px))] flex-col bg-white shadow-2xl lg:m-4 lg:h-[calc(100%-32px)] lg:rounded-3xl">
        <div className="flex min-h-16 items-center justify-between border-b border-slate-200 px-4"><div><p className="text-sm font-bold text-slate-950">IQC Knowledge Center</p><p className="mt-0.5 text-xs text-slate-500">Powered by JOJO</p></div><button ref={closeRef} className="icon-button size-11" onClick={onClose} aria-label="Close navigation"><X size={21} /></button></div>
        <nav className="flex-1 space-y-1.5 p-3">
          <button type="button" onClick={onNewConversation} className="flex min-h-11 w-full items-center gap-3 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700"><MessageSquarePlus size={19} />New Conversation</button>
          <div className="my-3 h-px bg-slate-100" />
          {items.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => { onNavigate(key); onClose(); }} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium ${currentPage === key ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`} aria-current={currentPage === key ? "page" : undefined}><Icon size={19} />{label}</button>)}
        </nav>
        <div className="border-t border-slate-200 p-3"><button type="button" disabled className="flex min-h-11 w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm text-slate-400" title="Available after authentication is added"><LogOut size={19} />Logout <span className="ml-auto text-[10px] uppercase">Future</span></button></div>
      </aside>
    </div>
  );
}
