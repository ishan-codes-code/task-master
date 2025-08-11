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

export const fetchAllTasks = async (setTasks, setPTasks) => {
  try {
    const response = await api.get("task/show");
    if (setTasks) {
      const raw = response.data.tasks;

      setTasks(Array.isArray(raw) ? raw : [raw]);
    }
    if (setPTasks) {
      setPTasks(response.data.pTasks);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTask = async (
  taskId,
  updates,
  setTask,
  setLoader,
  setTasks
) => {
  try {
    if (setLoader) setLoader(true);
    const response = await api.put(`/task/update/${taskId}`, updates);
    const updatedTask = response.data.updatedTask;
    if (setTask) setTask(updatedTask);
    if (setTasks)
      setTasks((prev) => {
        if (!Array.isArray(prev)) {
          console.log("'prev' is not an array in setTasks:", prev);
          return [updatedTask]; // Fallback: replace with single item array
        }
        return prev.map((t) => (t._id === updatedTask._id ? updatedTask : t));
      });
    return true;
  } catch (err) {
    console.log(err);
  } finally {
    if (setLoader) setLoader(false);
  }
};

export const dropTask = async (id, setTasks) => {
  try {
    const response = await api.patch(`/task/drop?id=${id}`);
    if (setTasks) setTasks((prev) => prev.filter((task) => task._id !== id));
  } catch (error) {
    console.log(error);
  }
};
