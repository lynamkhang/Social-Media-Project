import { Outlet } from "react-router";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Topbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
