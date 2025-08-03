import { X } from "lucide-react";
import { useState } from "react";

export default function ProjectModal({ isOpen, onClose, setLoader }) {
  if (!isOpen) return;

  const [taskCount, setTaskCount] = useState(1);
  const [tasks, setTasks] = useState([""]);

  const handleTaskChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  const addTask = () => setTasks([...tasks, " "]);

  const removeTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div
      id="projectModal"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      {/* <!-- Modal Box --> */}
      <div
        className="bg-white max-h-[99vh] overflow-y-auto w-full max-w-2xl mx-auto my-8 p-8 rounded-3xl shadow-xl border border-gray-200 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <!-- Header with Icon --> */}
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l6 6v10a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            <X />
          </button>
        </div>

        {/* <!-- Form Start --> */}
        <form onsubmit="submitForm(event)" className="space-y-5">
          {/* <!-- Project Name --> */}
          <div>
            <label
              className="text-sm text-gray-600 block mb-1"
              htmlFor="projectName"
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              placeholder="Awesome feature tracker"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* <!-- Description --> */}
          <div>
            <label
              className="text-sm text-gray-600 block mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Brief summary"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            ></textarea>
          </div>

          {/* <!-- Due Date & Priority Row --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="text-sm text-gray-600 block mb-1"
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                className="text-sm text-gray-600 block mb-1"
                htmlFor="priority"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Choose...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* <!-- Team Members --> */}

          {/* <!-- Tasks Section --> */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">
              Tasks
            </label>
            <div id="tasksContainer" className="space-y-3">
              {/* <!-- Default Task Row --> */}

              {tasks.map((task, index) => (
                <div key={index} className="flex gap-2 animate-fadeIn">
                  <input
                    type="text"
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder="Task title"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTask}
              className="mt-3 text-sm text-purple-600 hover:underline"
            >
              + Add another task
            </button>
          </div>

          {/* <!-- Action Buttons --> */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
