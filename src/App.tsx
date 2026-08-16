import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatPage } from "@/pages/ChatPage";
import { DocumentsPage } from "@/pages/DocumentsPage";
import { NGHistoryPage } from "@/pages/NGHistoryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AboutPage } from "@/pages/AboutPage";
import type { PageKey } from "@/types";

export function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("chat");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [conversationKey, setConversationKey] = useState(0);
  const page = { chat: <ChatPage key={conversationKey} />, documents: <DocumentsPage />, "ng-history": <NGHistoryPage />, settings: <SettingsPage />, about: <AboutPage /> }[currentPage];
  const startNewConversation = () => {
    setConversationKey((current) => current + 1);
    setCurrentPage("chat");
    setDrawerOpen(false);
  };
  return (
    <AppLayout currentPage={currentPage} drawerOpen={drawerOpen} onNavigate={setCurrentPage} onNewConversation={startNewConversation} onOpenDrawer={() => setDrawerOpen(true)} onCloseDrawer={() => setDrawerOpen(false)}>
      {page}
    </AppLayout>
  );
}
