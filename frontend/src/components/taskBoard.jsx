import { useState, useEffect } from "react";
import classNames from "classnames";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import CustomSelect from "./customSelect";

const TaskCard = ({ task, setOperateTask, setShowRightCon, operateTask }) => {
  const daysLeft = differenceInDays(new Date(task.dueDate), new Date());

  const dueColor = classNames("text-black px-2 py-1 rounded text-xs", {
    "bg-red-500 text-white": daysLeft <= 3,
    "bg-yellow-400": daysLeft > 3 && daysLeft <= 7,
    "bg-green-500": daysLeft > 7,
  });

  return (
    <button
      type="button"
      title="Click for more..."
      className={`bg-white rounded-2xl p-3 border w-full flex flex-col items-start gap-1 transition-all duration-300 ${
        operateTask?._id === task._id && "border-blue-500"
      }`}
      onClick={() => {
        setOperateTask(task);
        setShowRightCon(2);
      }}
    >
      <div className="text-gray-900 font-semibold text-base">{task.title}</div>
      <div className="flex flex-wrap items-center gap-2 mt-1">
        <div className="text-xs text-gray-500">
          Created {formatDistanceToNowStrict(new Date(task.createdAt))} ago
        </div>
        <span className={dueColor}>Due in {daysLeft} days</span>
        <span
          className={`${
            task.isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          } text-xs px-2 py-1 rounded`}
        >
          {task.isCompleted ? "Completed" : "Pending"}
        </span>
      </div>
    </button>
  );
};

const TaskGroup = ({
  label,
  filteredTasks,
  setOperateTask,
  setShowRightCon,
  operateTask,
}) => {
  let height;

  if (filteredTasks.length < 1) return;
  if (filteredTasks.length < 4) {
    height = "auto";
  } else if (filteredTasks.length > 4) {
    height = "400px";
  }
  const [sortedTasks, setSortedTasks] = useState(filteredTasks);

  useEffect(() => {
    setSortedTasks(filteredTasks);
  }, [filteredTasks]);

  const sortFunctions = [
    () => {
      setSortedTasks((prev) =>
        [...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      ); // Newest first
    },
    () => {
      setSortedTasks((prev) =>
        [...prev].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      ); // Oldest first
    },
    () => {
      setSortedTasks((prev) =>
        [...prev].sort((a, b) => a.title.localeCompare(b.title))
      ); // A-Z by title
    },
  ];

  return (
    <div className="space-y-4 p-2 ">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold text-gray-800">{label}</h2>
        <CustomSelect
          options={["Sort: Newest", "Oldest", "A-Z"]}
          sortFunctions={sortFunctions}
        />
      </div>

      <div
        className={`space-y-3 h-[${height}] overflow-y-auto ${
          height === "400px" ? "pr-4" : ""
        }`}
      >
        {sortedTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            setOperateTask={setOperateTask}
            setShowRightCon={setShowRightCon}
            operateTask={operateTask}
          />
        ))}
      </div>
    </div>
  );
};

function TaskBoard({
  tasks,
  setOperateTask,
  setShowRightCon,
  showRightCon,
  operateTask,
  onlyDueSoon,
}) {
  if (!Array.isArray(tasks)) {
    return <div>Loading tasks...</div>; // or null
  }

  const dueSoon = [];
  const next = [];
  const later = [];

  const today = new Date();

  tasks.forEach((task) => {
    const daysLeft = differenceInDays(new Date(task.dueDate), today);
    if (daysLeft <= 3) dueSoon.push(task);
    else if (daysLeft <= 7) next.push(task);
    else later.push(task);
  });
  if (onlyDueSoon) {
    return (
      <div>
        <TaskGroup
          label="Due Soon"
          filteredTasks={dueSoon}
          setOperateTask={setOperateTask}
          setShowRightCon={setShowRightCon}
          operateTask={operateTask}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col sm:flex-row gap-8 w-full items-center justify-center sm:items-start ${
        showRightCon && "flex-col-md-lg items-center-md-lg"
      }`}
    >
      <TaskGroup
        label="Due Soon"
        filteredTasks={dueSoon}
        setOperateTask={setOperateTask}
        setShowRightCon={setShowRightCon}
        operateTask={operateTask}
      />
      <TaskGroup
        label="Next"
        filteredTasks={next}
        setOperateTask={setOperateTask}
        setShowRightCon={setShowRightCon}
        operateTask={operateTask}
      />
      <TaskGroup
        label="Later"
        filteredTasks={later}
        setOperateTask={setOperateTask}
        setShowRightCon={setShowRightCon}
        operateTask={operateTask}
      />
    </div>
  );
}

export default TaskBoard;
