import { Link, useLocation } from "react-router";
import { MessageCircle } from "lucide-react";
import SearchBar from "../ui/searchbar";
import Signout from "../auth/Signout";

const Topbar = () => {
  const { pathname } = useLocation();

  return (
    <section className="topbar w-full bg-white shadow-sm">
      <div className="flex items-center justify-between py-4 px-5">
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
            to="/chat"
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
                src="/user.png"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </summary>
            <div className="absolute right-0 z-10 mt-2 min-w-36 rounded-md border bg-white p-1 shadow-lg">
              <Signout />
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
