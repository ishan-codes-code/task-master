import React, { useEffect, useState } from "react";
import api from "../service/apiService";
import {
  Trash2,
  CheckCircle,
  Clock,
  User,
  Hash,
  CalendarDays,
  RefreshCcw,
  CircleX,
  AlertTriangle,
  CircleArrowUp,
} from "lucide-react";
import {
  daysLeft,
  formatDateWithLabels,
  isFutureDate,
} from "../functions/operateDates";
import { Loader, Indicator } from "./item";
import { updateTask, dropTask } from "../functions/operateTasks";
import { showSuccess, showError } from "./toaster";
import { useMyContext } from "../context/Context";

const TaskOverview = ({ task, setShowRightCon, setOperateTask }) => {
  const { isMobile, setTasks } = useMyContext();

  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate.split("T")[0]);
  const [loader, setLoader] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDueDate(task.dueDate.split("T")[0]);
  }, [task]);

  const handleToggleComplete = () => {
    if (task.isCompleted) {
      updateTask(
        task._id,
        { isCompleted: false },
        setOperateTask,
        setLoader,
        setTasks
      );
    } else {
      updateTask(
        task._id,
        { isCompleted: true },
        setOperateTask,
        setLoader,
        setTasks
      );
    }
  };

  const handleDropTask = async () => {
    try {
      const response = await api.patch(`/task/drop?id=${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      setShowRightCon();
      setOperateTask({});
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleSave = () => {
    const updates = {};
    if (title !== task.title) {
      updates.title = title;
    }
    if (dueDate != task.dueDate.split("T")[0]) {
      updates.dueDate = dueDate;
    }
    if (Object.keys(updates).length > 0) {
      updateTask(task._id, updates, setOperateTask, setLoader, setTasks);
    }
  };

  const moodStyles = {
    icon: task.isCompleted ? (
      <CheckCircle className="text-green-600 w-5 h-5" />
    ) : (
      <AlertTriangle className="text-yellow-500 w-5 h-5" />
    ),
    label: task.isCompleted ? "Completed" : "Pending",
    labelColor: task.isCompleted ? "text-green-700" : "text-yellow-700",
    bgPanel: task.isCompleted ? "bg-green-50" : "bg-yellow-50",
    border: task.isCompleted ? "border-green-500" : "border-yellow-500",
    moodText: task.isCompleted
      ? "You're all set. Great job!"
      : "This task needs your attention.",
    toggleBtn: task.isCompleted
      ? "bg-yellow-50 text-yellow-800 hover:bg-yellow-200"
      : "bg-green-100 text-green-700 hover:bg-green-200",
    toggleText: task.isCompleted ? "Mark Pending" : "Mark Complete",
  };

  return (
    <div
      className={`md:w-full h-full w-full absolute z-[60] md:static px-6 py-4 flex flex-col items-center overflow-auto bg-white/70 backdrop-blur-md border md:border-0 md:border-l ${moodStyles.border} fade-enter`}
    >
      {loader && <Loader type={2} />}
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Task Overview</h2>
        {(title !== task.title ||
          (dueDate != task.dueDate.split("T")[0] && !isEditingDueDate)) && (
          <button
            className="h-fit flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-100 hover:text-green-700 transition"
            onClick={handleSave}
          >
            <CircleArrowUp className="text-lg" /> Save
          </button>
        )}
        <CircleX
          onClick={() => {
            setShowRightCon();
            setOperateTask([]);
          }}
          className="w-5 h-5 cursor-pointer hover:text-red-500 transition duration-300"
        />
      </div>

      <div className={`w-full p-4 rounded-md ${moodStyles.bgPanel}`}>
        <div className="flex items-center gap-2 mb-2">
          {moodStyles.icon}
          <span className={`font-semibold ${moodStyles.labelColor}`}>
            {moodStyles.label}
          </span>
        </div>
        <div className="text-sm text-gray-600 italic">
          {moodStyles.moodText}
        </div>
      </div>

      <div className="space-y-4 text-sm text-gray-700 w-full mt-6 ">
        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="w-4 h-4" />
            <span className="uppercase text-xs">Title</span>
          </div>
          <div
            className="font-medium text-gray-800 cursor-pointer"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newTitle = e.target.textContent.trim();
              setTitle(newTitle);
            }}
            title="Click to change title"
          >
            {title}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="uppercase text-xs">Due In</span>
          </div>
          {!isEditingDueDate && (
            <div
              onClick={() => setIsEditingDueDate(true)}
              className="font-medium text-gray-800 cursor-pointer"
              title="Click to change due date"
            >
              {daysLeft(dueDate)} days left
            </div>
          )}
          {isEditingDueDate && (
            <input
              autoFocus
              type="date"
              value={dueDate}
              className="text-gray-600 text-sm border rounded px-2 py-1"
              onChange={(e) => {
                setDueDate(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value === task.dueDate.split("T")[0]) {
                  setIsEditingDueDate(false);
                  return;
                }
                const isValid = isFutureDate(e.target.value);
                if (isValid === true) {
                  setIsEditingDueDate(false);
                } else {
                  showError(isValid, isMobile);
                }
              }}
            />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarDays className="w-4 h-4" />
            <span className="uppercase text-xs">Created At</span>
          </div>
          <div className="font-medium text-gray-800">
            {formatDateWithLabels(new Date(task.createdAt)) || "–"}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <RefreshCcw className="w-4 h-4" />
            <span className="uppercase text-xs">Updated At</span>
          </div>
          <div className="font-medium text-gray-800">
            {formatDateWithLabels(new Date(task.updatedAt)) || "–"}
          </div>
        </div>

        {task.assignedTo && (
          <div>
            <div className="flex items-center gap-2 text-gray-500">
              <User className="w-4 h-4" />
              <span className="uppercase text-xs">Assigned To</span>
            </div>
            <div className="font-medium text-gray-800">{task.assignedTo}</div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition shadow ${moodStyles.toggleBtn}`}
            onClick={handleToggleComplete}
          >
            {moodStyles.toggleText}
          </button>

          <button
            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-sm font-medium flex items-center gap-2 transition shadow"
            onClick={handleDropTask}
          >
            <Trash2 className="w-4 h-4" />
            Drop Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
