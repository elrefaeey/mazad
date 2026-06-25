import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#DBDBDB]">
      <Navbar />
      <main className="flex-1 bg-transparent">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
