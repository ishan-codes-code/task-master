import api from "../service/apiService";

export const fetchTask = async (pageNum, setTasks, setHasMore, setLoading) => {
  try {
    const response = await api.get(`/task/show?page=${pageNum}&limit=10`);
    const newTasks = response.data.tasks;

    if (setTasks) {
      setTasks((prev) => {
        const taskMap = new Map(prev.tasks.map((t) => [t._id, t]));

        newTasks.forEach((t) => {
          taskMap.set(t._id, t);
        });
        return {
          tasks: Array.from(taskMap.values()),
          total: response.data.total,
          completed: response.data.completed,
        };
      });
    }

    if (setHasMore) setHasMore(newTasks.length > 0);
  } catch (error) {
    console.error("Fetch tasks failed:", error);
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const fetchAllTasks = async () => {
  try {
    const response = await api.get("task/show");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateTask = async (
  taskId,
  updates,
  setTask,
  setLoader,
  setTasksData
) => {
  try {
    if (setLoader) setLoader(true);
    const response = await api.put(`/task/update/${taskId}`, updates);
    const updatedTask = response.data.updatedTask;
    if (setTask) setTask(updatedTask);
    if (setTasksData)
      setTasksData((prev) => {
        const updatedTasks = prev.tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        return {
          tasks: updatedTasks,
          total: prev.total,
          completed: prev.completed,
        };
      });
  } catch (err) {
    console.log(err);
  } finally {
    if (setLoader) setLoader(false);
  }
};
