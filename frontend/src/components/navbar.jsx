import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useMyContext } from "../context/Context";
import LogoutButton from "./logoutButton";
import { FaSearch } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { useLocation } from "react-router-dom";
import { MdPeopleOutline, MdOutlineAutoDelete } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { GoTasklist } from "react-icons/go";
import { CiFileOn } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { PiQuestionMarkLight } from "react-icons/pi";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 flex items-center justify-between p-4 shadow-sm">
      <div>
        <NavLink
          className="text-gray-800 text-2xl font-semibold tracking-tight"
          to="/"
        >
          Task Master
        </NavLink>
      </div>
      <ul className="flex gap-4 list-none items-center">
        <li className="block h-[100%] w-[10px]">
          <span className="block h-[20px] w-[1px] bg-[#ccc]"></span>
        </li>
        <li>
          <NavLink
            className="bg-white hover:text-gray-800 text-gray-500 px-3 py-2 rounded-[8px] transition"
            to="/login"
          >
            Sign in
          </NavLink>
        </li>
        <li>
          <NavLink
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-[8px] font-medium transition"
            to="/signup"
          >
            Sign Up
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

const Navbar2 = () => {
  const location = useLocation();
  return (
    <nav
      className={
        location.pathname != "/dashboard"
          ? "h-[80px] py-1 px-6 max-h-[80px] flex justify-between items-center"
          : "  h-[80px]  max-h-[80px] flex justify-between items-center"
      }
    >
      <NavLink
        className="text-gray-800 text-2xl font-semibold tracking-tight capitalize"
        to={location.pathname}
      >
        {location.pathname.split("/").filter(Boolean).pop()}
      </NavLink>

      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Search tasks or projects..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition rounded-xl shadow-sm"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          <FaSearch />
        </span>
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const { isMobile, showSidebar, setShowSidebar } = useMyContext();
  // const location = useLocation();
  // if (location.pathname === "/project") setShowSidebar(false);
  const [delayedClass, setDelayedClass] = useState(
    "flex  flex-col items-center"
  );
  const [delayedClass2, setDelayedClass2] = useState(
    "flex  flex-col items-center"
  );

  useEffect(() => {
    if (showSidebar) {
      const timeout = setTimeout(() => {
        setDelayedClass2("flex flex-col items-center");
        setDelayedClass("hidden");
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDelayedClass("flex flex-col items-center");
        setDelayedClass2("hidden");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [showSidebar]);

  // if (!showSidebar) return null;
  if (isMobile) return null;

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen px-4 py-6 
      flex flex-cols justify-center overflow-hidden transition-all duration-500 ease-in-out 
      ${showSidebar ? "w-[220px]" : "w-[60px]"}`}
    >
      <nav
        className={`transition-all duration-300 gap-3 ${delayedClass} ${
          showSidebar ? "opacity-0" : "opacity-100"
        }`}
      >
        <span
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-xl cursor-pointer text-purple-700 px-3 py-2"
        >
          {showSidebar ? <GoSidebarExpand /> : <GoSidebarCollapse />}
        </span>
        <div className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <FaHome /> */}
            <IoHomeOutline />

            {/* Dashboard */}
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <FaTasks /> */}
            <GoTasklist />

            {/* My Tasks */}
          </NavLink>
          <NavLink
            to="/project"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <FaFile /> */}
            <CiFileOn />

            {/* Projects */}
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <MdGroups /> */}
            <MdPeopleOutline />

            {/* Team */}
          </NavLink>
          <NavLink
            to="/bin"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <MdAutoDelete /> */}
            <MdOutlineAutoDelete />

            {/* Bin */}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <IoMdSettings /> */}
            <IoSettingsOutline />

            {/* Settings */}
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-purple-50 text-purple-700 transition duration-500 text-lg ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }
              
              `
            }
          >
            {/* <IoMdHelp /> */}
            <PiQuestionMarkLight />

            {/* Help */}
          </NavLink>
        </div>
      </nav>

      <nav
        className={`transition-all duration-300 ${delayedClass2} ${
          showSidebar ? "opacity-100" : "opacity-0"
        } `}
      >
        <div className="flex gap-2 items-center justify-between w-full mb-4">
          <span
            onClick={() => setShowSidebar(false)}
            className="text-xl cursor-pointer"
          >
            <GoSidebarExpand />
          </span>
          <NavLink
            className="text-gray-800 text-2xl font-semibold tracking-tight whitespace-nowrap"
            to="/"
          >
            Task Master
          </NavLink>
        </div>
        <div className="flex flex-col">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <FaHome /> */}
              <IoHomeOutline />
            </span>
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <FaTasks /> */}
              <GoTasklist />
            </span>
            My Tasks
          </NavLink>
          <NavLink
            to="/project"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <FaFile /> */}
              <CiFileOn />
            </span>
            Projects
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <MdGroups /> */}
              <MdPeopleOutline />
            </span>
            Team
          </NavLink>
          <NavLink
            to="/bin"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <MdAutoDelete /> */}
              <MdOutlineAutoDelete />
            </span>
            Bin
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <IoMdSettings /> */}
              <IoSettingsOutline />
            </span>
            Settings
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 text-gray-700 px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition ${
                isActive ? "bg-purple-50 text-purple-700" : ""
              }`
            }
          >
            <span className="text-purple-600">
              {/* <IoMdHelp /> */}
              <PiQuestionMarkLight />
            </span>
            Help
          </NavLink>
        </div>
        <LogoutButton />
      </nav>
    </aside>
  );
};

const MobileNavbar = () => {
  const { isMobile } = useMyContext();
  if (!isMobile) return null;
  return (
    <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl rounded-2xl bg-white/70 backdrop-blur-md shadow-lg">
      <nav className="flex items-center justify-between px-4 py-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <IoHomeOutline />
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <GoTasklist />
        </NavLink>

        <NavLink
          to="/project"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <CiFileOn />
        </NavLink>

        <NavLink
          to="/team"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <MdPeopleOutline />
        </NavLink>

        <NavLink
          to="/bin"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <MdOutlineAutoDelete />
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <IoSettingsOutline />
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex flex-col items-center text-2xl transition duration-300 ${
              isActive
                ? "text-purple-600"
                : "text-gray-700 hover:text-purple-500"
            }`
          }
        >
          <PiQuestionMarkLight />
        </NavLink>
      </nav>
    </aside>
  );
};

export { Navbar, Navbar2, Sidebar, MobileNavbar };
