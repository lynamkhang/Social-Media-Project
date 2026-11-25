import { AppSidebar } from "@/components/app-sidebar"
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { SidebarProvider } from "@/components/ui/sidebar"

const ChatPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout/>

      </div>
    </SidebarProvider>
  );
};

export default ChatPage