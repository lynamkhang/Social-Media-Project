import { AppSidebar } from "@/components/app-sidebar"
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { SidebarProvider } from "@/components/ui/sidebar"

const ChatPage = () => {
  return (
    <SidebarProvider className="min-h-0 flex-1">
      <AppSidebar />
      <div className="flex flex-1 w-full p-2">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default ChatPage