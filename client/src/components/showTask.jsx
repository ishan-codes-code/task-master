import { useEffect, useState, useRef, useCallback } from "react";
import { FaRegClock } from "react-icons/fa";
import ScrollItem from "./scrollItem";
import { Loader } from "./item";
import { fetchTask } from "../functions/operateTasks";
import { useMyContext } from "../context/Context";

function ShowTask({
  setOperateTask,
  hasMore,
  setHasMore,
  page,
  setPage,
  setShowRightCon,
  status = "pending",
  sort,
}) {
  const [loading, setLoading] = useState(false);

  const { tasksData, setTasksData } = useMyContext();

  const observerRef = useRef();

  const loadMoreRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          setPage((prev) => prev + 1);
          // console.log(page);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );
  // console.log(observerRef);
  // console.log(loadMoreRef);
  // console.log(tasksData.tasks);
  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    fetchTask(page, setTasksData, setHasMore, setLoading);
  }, [page]);

  const daysLeft = (date) => {
    const dueDate = new Date(date);
    const today = new Date();
    const timeDiff = dueDate - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="overflow-y-auto h-[200px] py-2 rounded-lg space-y-4">
      {tasksData.tasks
        .filter((task) => task.projectId === null)
        .filter((task) => {
          if (status === "all") return true;
          if (status === "completed") return task.isCompleted;
          if (status === "pending") return !task.isCompleted;
        })
        .sort((a, b) => {
          if (sort === "newest") {
            return 0;
          }
          if (sort === "deadline") {
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
          if (sort === "a-z") {
            return a.title.localeCompare(b.title);
          }
          return 0;
        })
        .map((task) => (
          <ScrollItem
            onClick={() => {
              setOperateTask(task);
              setShowRightCon(2);
            }}
            styles="bg-white w-[90%] mx-auto cursor-pointer flex justify-between items-center p-2 h-auto rounded-lg hover:shadow-lg shadow-md"
            key={task._id}
          >
            <h3 className="text-md font-semibold text-gray-800">
              {task.title}
            </h3>
            <div className="flex items-center">
              {task.dueDate && (
                <span className="text-sm flex gap-2 items-center">
                  <FaRegClock className="fill-gray-500" />
                  <p>{daysLeft(task.dueDate)} days left</p>
                </span>
              )}
              {!task.isCompleted && (
                <span className="px-3 py-1 text-sm rounded-full text-yellow-600">
                  Pending
                </span>
              )}
              {task.isCompleted && (
                <span className="px-3 py-1 text-sm rounded-full text-green-600">
                  Completed
                </span>
              )}
            </div>
          </ScrollItem>
        ))}

      {loading && <Loader />}
      {!loading && hasMore && <div ref={loadMoreRef} className="h-8" />}
      {!hasMore && (
        <p className="text-center text-sm text-gray-500">
          No more incomplete tasks to load
        </p>
      )}
    </div>
  );
}

export default ShowTask;
