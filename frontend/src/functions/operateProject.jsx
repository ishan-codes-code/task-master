import api from "../service/apiService";
import { useNavigate } from "react-router-dom";

export const fetchProject = async (
  pageNum,
  setProjects,
  setHasMore,
  setLoader,
) => {
  if (setLoader) setLoader(true);
  try {
    const response = await api.get(`/project/show?page=${pageNum}&limit=5`);
    const newProjects = response.data.projects;

    if (setProjects) {
      setProjects((prev) => {
        const projectMap = new Map(prev.projects.map((p) => [p._id, p]));

        // Overwrite existing or add new
        newProjects.forEach((p) => {
          projectMap.set(p._id, p);
        });

        return {
          projects: Array.from(projectMap.values()),
          total: response.data.total,
          completed: response.data.completed,
        };
      });
    }

    if (setHasMore) setHasMore(newProjects.length > 0);
  } catch (error) {
    console.error("Fetch projects failed:", error);
  } finally {
    if (setLoader) setLoader(false);
  }
};

export const updateProject = async (id, data, setProject, setLoader) => {
  if (setLoader) setLoader(true);
  try {
    // console.log(data);
    const response = await api.put(`/project/update/${id}`, data);
    setProject(response.data.updatedProject);
  } catch (error) {
    console.log("Failed:", error);
  } finally {
    if (setLoader) setLoader(false);
  }
};

export const deleteProject = async (
  data,
  setLoader,
  showSuccess,
  showError,
  setProjectsData,
  navigate,
) => {
  if (setLoader) setLoader(true);
  try {
    const response = await api.post(`/project/delete`, data);
    showSuccess(response.data.message);
    setProjectsData({ projects: [], total: 0, completed: 0 });
    navigate("/project");
  } catch (error) {
    showError(error.response?.data?.message || error.message);
  } finally {
    if (setLoader) setLoader(false);
  }
};
