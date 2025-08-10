import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X } from "lucide-react";
import { isFutureDate } from "../functions/operateDates";
import { showError, showSuccess } from "./toaster";
import api from "../service/apiService";
import { useMyContext } from "../context/Context";
import { Loader } from "./item";

export default function ProjectModal({ isOpen, onClose }) {
  const { setProjects, setPTasks } = useMyContext();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      tasks: [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const [loader, setLoader] = useState(false);

  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const response = await api.post("/project/add", data);
      setProjects((prev) => [...prev, response?.data?.project]);
      setPTasks((prev) => [...prev, ...response?.data?.pTasks]);
      showSuccess(response?.data?.message);
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message || err.message);
    } finally {
      setLoader(false);
      onClose();
    }
  };
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      id="projectModal"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      {loader && <Loader type={2} />}
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
        <form className={`space-y-5 `} onSubmit={handleSubmit(onSubmit)}>
          {/* Project Name */}
          <div className={`space-y-1 ${errors.pTitle && "animate-shake"}`}>
            <label className="text-sm text-gray-600 block mb-1">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Awesome feature tracker"
              {...register("pTitle", { required: "Project title is required" })}
              className={`w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none transition ${
                errors.pTitle
                  ? "border-red-300 focus:ring-1 focus:ring-red-500"
                  : "border-gray-300 focus:ring-2 focus:ring-purple-500"
              } border`}
            />
            {errors.pTitle && (
              <p className="text-red-500 text-sm">{errors.pTitle.message}</p>
            )}
          </div>

          {/* Description */}
          <div className={`space-y-1 ${errors.pDesc && "animate-shake"}`}>
            <label className="text-sm text-gray-600 block mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Brief summary"
              {...register("pDesc", { required: "Description is required" })}
              className={`w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none ${
                errors.pDesc
                  ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                  : "border-gray-300 focus:ring-2 focus:ring-purple-500"
              } border`}
            ></textarea>
            {errors.pDesc && (
              <p className="text-red-500 text-sm">{errors.pDesc.message}</p>
            )}
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`space-y-1 ${errors.pDueDate && "animate-shake"}`}>
              <label className="text-sm text-gray-600 block mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register("pDueDate", {
                  required: "Due date is required",
                  validate: isFutureDate,
                })}
                className={`w-full bg-white px-4 py-2.5 rounded-lg shadow-sm focus:outline-none ${
                  errors.pDueDate
                    ? "border-red-300 focus:ring-1 focus:ring-red-500 animate-shake"
                    : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                } border`}
              />
              {errors.pDueDate && (
                <p className="text-red-500 text-sm">
                  {errors.pDueDate.message}
                </p>
              )}
            </div>

            <div className={`space-y-1 ${errors.priority && "animate-shake"}`}>
              <label className="text-sm text-gray-600 block mb-1">
                Priority
              </label>
              <select
                {...register("priority", {
                  required: "Project priority is required",
                })}
                className={`w-full bg-white px-2 py-2.5 rounded-lg shadow-sm focus:outline-none ${
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
              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Tasks */}
          <div className={`${errors.tasks && "animate-shake"}`}>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Tasks
              </label>
              {errors.tasks && (
                <p className="text-red-500 text-sm">
                  Atleast one tasks is required
                </p>
              )}
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 animate-fadeIn">
                  <input
                    type="text"
                    {...register(`tasks.${index}.title`, {
                      required: index === 0 ? "Task title is required" : false,
                    })}
                    placeholder="Task title"
                    className={`flex-1 px-4 py-2 rounded-lg shadow-sm focus:outline-none border ${
                      errors.tasks?.[index]?.title
                        ? "border-red-300 focus:ring-1 focus:ring-red-500"
                        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                    }`}
                  />

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                append({ title: "" });
              }}
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
              disabled={isSubmitting}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-200"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
