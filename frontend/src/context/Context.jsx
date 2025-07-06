import { createContext, useContext, useState, useEffect } from "react";
import api from "../service/apiService";

const MyContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [accessToken, setAccessToken] = useState(null);
  const [tasksData, setTasksData] = useState({
    tasks: [],
    total: 0,
    completed: 0,
  });
  const [projectsData, setProjectsData] = useState({
    projects: [],
    total: 0,
    completed: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [pTasks, setPTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (accessToken) {
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <MyContext.Provider
      value={{
        isMobile,
        accessToken,
        setAccessToken,
        tasksData,
        setTasksData,
        showSidebar,
        setShowSidebar,
        projectsData,
        setProjectsData,
        tasks,
        setTasks,
        projects,
        setProjects,
        pTasks,
        setPTasks,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
export const useMyContext = () => useContext(MyContext);
