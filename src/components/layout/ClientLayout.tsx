import Footer from "./Footer";
import ClientNavbar from "../ClientNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ClientLayout() {
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-[#F3FAF7]">
      <ClientNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {location.pathname != "/client" && <Footer />}
    </div>
  );
}
