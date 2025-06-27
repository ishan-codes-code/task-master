import { Outlet, useLocation } from "react-router-dom";
import { Navbar2, Sidebar, MobileNavbar } from "../components/navbar";
import { useState, useEffect } from "react";

export default function WorkSpace() {
  const [showNav, setShowNav] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/tasks" ||
      location.pathname === "/project" ||
      location.pathname.startsWith("/project/")
    ) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location.pathname]);

  return (
    <section className="flex flex-cols min-h-screen relative">
      <Sidebar />
      <main className="min-h-[100%] w-full relative">
        {showNav && <Navbar2 />}

        <Outlet />
      </main>
      <MobileNavbar />
    </section>
  );
}
