import type { ReactNode } from "react";
import type { PageKey } from "@/types";
import { AppHeader } from "./AppHeader";
import { MobileDrawer } from "./MobileDrawer";
import { useVisualViewport } from "@/hooks/useVisualViewport";

interface AppLayoutProps {
  children: ReactNode; currentPage: PageKey; drawerOpen: boolean;
  onNavigate: (page: PageKey) => void; onNewConversation: () => void; onOpenDrawer: () => void; onCloseDrawer: () => void;
}

export function AppLayout({ children, currentPage, drawerOpen, onNavigate, onNewConversation, onOpenDrawer, onCloseDrawer }: AppLayoutProps) {
  useVisualViewport();
  return (
    <div className="app-shell flex overflow-hidden bg-white text-slate-900">
      <MobileDrawer open={drawerOpen} currentPage={currentPage} onNavigate={onNavigate} onNewConversation={onNewConversation} onClose={onCloseDrawer} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenDrawer={onOpenDrawer} />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
