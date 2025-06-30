import classNames from "classnames";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";

const TaskCard = ({ task }) => {
  const daysLeft = differenceInDays(new Date(task.dueDate), new Date());

  const dueColor = classNames("text-black px-2 py-1 rounded text-xs", {
    "bg-red-500 text-white": daysLeft <= 3,
    "bg-yellow-400": daysLeft > 3 && daysLeft <= 7,
    "bg-green-500": daysLeft > 7,
  });

  return (
    <div className="bg-white rounded-2xl p-3 border flex flex-col gap-1">
      <div className="text-gray-900 font-semibold text-base">{task.title}</div>
      <div className="flex items-center gap-2 mt-1">
        <div className="text-xs text-gray-500">
          Created {formatDistanceToNowStrict(new Date(task.createdAt))} ago
        </div>
        <span className={dueColor}>Due in {daysLeft} days</span>
        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
          Pending
        </span>
      </div>
    </div>
  );
};

const TaskGroup = ({ label, tasks }) => (
  <div className="space-y-4 p-2 ">
    <h2 className="text-xl font-bold text-gray-800">{label}</h2>
    <div className="space-y-3 h-[400px] overflow-y-auto scroll-smooth pr-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  </div>
);

const TaskBoard = ({ tasks }) => {
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

  return (
    <div className="hidden lg:grid grid-cols-3 gap-8 mt-8">
      <TaskGroup label="Due Soon" tasks={dueSoon} />
      <TaskGroup label="Next" tasks={next} />
      <TaskGroup label="Later" tasks={later} />
    </div>
  );
};

export default TaskBoard;
