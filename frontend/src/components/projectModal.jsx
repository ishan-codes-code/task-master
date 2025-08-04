import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { isFutureDate } from "../functions/operateDates";
import { showError, showSuccess } from "./toaster";

export default function ProjectModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [tasks, setTasks] = useState([""]);
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      pTitle: "",
      desc: "",
      dueDate: "",
      priority: "",
    },
  });

  const handleTaskChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };
  const addTask = () => setTasks([...tasks, ""]);
  const removeTask = (index) => setTasks(tasks.filter((_, i) => i !== index));

  const onSubmit = (formData) => {
    const hasValidTask = tasks.some((task) => task.trim() !== "");
    let isValid = true;

    if (!hasValidTask) {
      setError("tasks", { type: "manual", message: "Add at least 1 task" });
      isValid = false;
    } else {
      clearErrors("tasks");
    }

    if (!isFutureDate(formData.dueDate)) {
      setError("dueDate", {
        type: "manual",
        message: "Date must be in future",
      });
      isValid = false;
    }

    // if (!isValid) {
    //   Object.values(errors).forEach((error) => {
    //     showError(error?.message);
    //   });
    //   return;
    // }

    setLoader(true);

    const projectPayload = {
      pTitle: formData.pTitle.trim(),
      pDesc: formData.desc.trim(),
      pDueDate: formData.dueDate,
      priority: formData.priority,
      tasks: tasks.filter((task) => task.trim() !== ""),
    };

    setTimeout(() => {
      console.log("Submitted Project:", projectPayload);
      setLoader(false);
      onClose();
    }, 1000);
  };
  Object.values(errors).forEach((error) => {
    showError(error?.message);
  });
  return (
    <div
      id="projectModal"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white max-h-[99vh] overflow-y-auto w-full max-w-2xl mx-auto my-8 p-8 rounded-3xl shadow-xl border border-gray-200 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
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

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Project Name */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Project Name
            </label>
            <input
              {...register("pTitle", { required: true })}
              type="text"
              placeholder="Awesome feature tracker"
              className={`w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none ${
                errors.pTitle
                  ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                  : "border-gray-300 focus:ring-2 focus:ring-purple-500"
              } border`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Description
            </label>
            <textarea
              {...register("desc", { required: true })}
              rows="3"
              placeholder="Brief summary"
              className={`w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none ${
                errors.desc
                  ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                  : "border-gray-300 focus:ring-2 focus:ring-purple-500"
              } border`}
            ></textarea>
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Due Date
              </label>
              <input
                {...register("dueDate", {
                  required: true,
                  validate: isFutureDate,
                })}
                type="date"
                className={`w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none ${
                  errors.dueDate
                    ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                    : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                } border`}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Priority
              </label>
              <select
                {...register("priority", { required: true })}
                className={`w-full px-2 py-2.5 rounded-lg shadow-sm focus:outline-none ${
                  errors.priority
                    ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                    : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                } border`}
              >
                <option value="">Choose...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">
              Tasks
            </label>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex gap-2 animate-fadeIn">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder="Task title"
                    className={`flex-1 px-4 py-2 rounded-lg shadow-sm focus:outline-none ${
                      errors.tasks && index === 0
                        ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                    } border`}
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

          {/* Action Buttons */}
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
