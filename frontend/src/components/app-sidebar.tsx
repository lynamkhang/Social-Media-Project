import * as React from "react";
import { Search, X } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CreateNewChat from "./chat/CreateNewChat";

type ChatFilter = "all" | "unread" | "group";

const CHAT_FILTERS: { key: ChatFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "unread", label: "Chưa đọc" },
  { key: "group", label: "Nhóm" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<ChatFilter>("all");

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex h-12 w-full items-center justify-between rounded-md bg-blue-600 px-4">
              <a href="#" className="text-xl font-bold text-white">
                UITChat
              </a>
              <div className="flex items-center gap-2">
                <CreateNewChat />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Thanh tìm kiếm */}
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <SidebarInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="pl-8 pr-8 rounded-full bg-slate-100 border-transparent focus-visible:bg-white focus-visible:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Xóa tìm kiếm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter chat */}
        <div className="flex items-center gap-1.5 pt-1">
          {CHAT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
