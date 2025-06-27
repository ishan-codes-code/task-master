import React, { useState } from 'react';
import { Trash2, CheckCircle, Clock, User, Hash, CalendarDays, RefreshCcw } from 'lucide-react';
import { daysLeft , formatDateWithLabels } from "../functions/operateDates";

const TaskOverview = ({ task }) => {
  // console.log(task);
  const [isCompleted, setIsCompleted] = useState(task.status === 'Completed');

  const handleToggleComplete = () => {
    setIsCompleted((prev) => !prev);
    // TODO: send update to backend here
  };

  const handleDropTask = () => {
    // TODO: drop/delete task from backend
    console.log("Task dropped:", task.id);
  };

  return (
    <div className="md:w-[35%] h-full w-full absolute z-40 md:static px-6 py-4 flex flex-col items-center overflow-auto bg-white/70 backdrop-blur-md border border-r border-grey-200">
      <h2 className="text-xl font-semibold mb-4">Task Overview</h2>

      <div className="space-y-4 text-sm text-gray-700 w-full">
        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="w-4 h-4" />
            <span className="uppercase text-xs">Title</span>
          </div>
          <div className="font-medium text-gray-800">{task.title}</div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="uppercase text-xs">Due In</span>
          </div>
          <div>{daysLeft(task.dueDate)} days left</div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="w-4 h-4" />
            <span className="uppercase text-xs">Status</span>
          </div>
          <div className={task.isCompleted ? "text-green-600" : "text-yellow-600"}>
            {task.isCompleted ? "Completed" : "Pending"}
          </div>
        </div>

        {/* <div>
          <div className="flex items-center gap-2 text-gray-500">
            <Hash className="w-4 h-4" />
            <span className="uppercase text-xs">Task ID</span>
          </div>
          <div className="break-words">{task.id}</div>
        </div> */}

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarDays className="w-4 h-4" />
            <span className="uppercase text-xs">Created At</span>
          </div>
          <div>{formatDateWithLabels(new Date(task.createdAt)) || '–'}</div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-gray-500">
            <RefreshCcw className="w-4 h-4" />
            <span className="uppercase text-xs">Updated At</span>
          </div>
          <div>{formatDateWithLabels(new Date(task.updatedAt)) || '–'}</div>
        </div>

        {task.assignedTo && (
          <div>
            <div className="flex items-center gap-2 text-gray-500">
              <User className="w-4 h-4" />
              <span className="uppercase text-xs">Assigned To</span>
            </div>
            <div>{task.assignedTo}</div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isCompleted ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
            }`}
            onClick={handleToggleComplete}
          >
            {isCompleted ? "Mark Pending" : "Mark Complete"}
          </button>

          <button
            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-sm font-medium flex items-center gap-2"
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
