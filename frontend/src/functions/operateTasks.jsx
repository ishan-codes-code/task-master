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
