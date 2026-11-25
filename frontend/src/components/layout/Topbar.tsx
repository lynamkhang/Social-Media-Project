import { Link, useLocation } from "react-router";
import { MessageCircle, House, Users } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import SearchBar from "../ui/searchbar";
import Signout from "../auth/Signout";

const Topbar = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  return (
    <section className="topbar sticky top-0 z-30 h-16 w-full bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-5">
        {/* Logo */}
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="UITSocial Logo" width={80} />
            <h1 className="text-3xl font-bold text-blue-600 leading-none">
              UITSocial
            </h1>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            title="Trang chủ"
            className={`p-3 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <House size={24} />
          </Link>

          <Link
            to="/friends"
            title="Bạn bè"
            className={`p-3 rounded-lg transition-colors ${
              pathname === "/friends"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Users size={24} />
          </Link>

          <Link
            to="/chat"
            title="Tin nhắn"
            className={`p-3 rounded-lg transition-colors ${
              pathname === "/chat"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <MessageCircle size={24} />
          </Link>
        </div>

        {/* Profile */}
        <div className="flex items-center justify-end ml-6">
          <details className="relative">
            <summary className="list-none cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-blue-600">
              <img
                src={user?.avatarUrl || "/user.png"}
                alt={user?.fullName || "Profile"}
                className="w-10 h-10 rounded-full object-cover"
              />
            </summary>
            <div className="absolute right-0 z-10 mt-2 min-w-52 rounded-md border bg-white p-1.5 shadow-lg">
              <Link
                to="/profile"
                onClick={(e) =>
                  e.currentTarget.closest("details")?.removeAttribute("open")
                }
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-slate-100 transition-colors"
              >
                <img
                  src={user?.avatarUrl || "/user.png"}
                  alt={user?.fullName || "Profile"}
                  className="size-9 rounded-full object-cover shrink-0"
                />
                <span className="truncate text-sm font-semibold text-slate-800">
                  {user?.fullName || "Người dùng"}
                </span>
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <Signout />
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
