import { Link } from "react-router";
import SearchBar from "../ui/searchbar";

const Topbar = () => {
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

        {/* Profile */}
        <div className="flex items-center justify-end">
          <Link
            to="/profile"
            className="flex items-center justify-center"
            title="Profile"
          >
            <img
              src="/user.png"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
