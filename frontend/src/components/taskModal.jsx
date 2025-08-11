import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { showError, showSuccess } from "../components/toaster";
import { useForm } from "react-hook-form";
import { useMyContext } from "../context/Context";
import api from "../service/apiService";
import { isFutureDate } from "../functions/operateDates";

export default function TaskModal({ isOpen, onClose, pId }) {
  const { isMobile, setTasks, setProjects, setPTasks } = useMyContext();

  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [onClose]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (pId) setValue("projectId", pId);
  }, [pId]);

  Object.values(errors).forEach((error) => {
    showError(error?.message, isMobile);
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/task/add", data);
      console.log(response.data);
      showSuccess(response.data.message, isMobile);

      if (pId != null) {
        reset({
          projectId: pId,
        });
      } else {
        reset();
      }

      setTasks((prev) => [...prev, response.data.task]);

      onClose();
    } catch (err) {
      showError(err.response?.data?.message || err.message, isMobile);
    }
  };
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md sm:w-[80%] mx-4 p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Task</h2>
          <button
            className="text-gray-500 text-xl hover:text-gray-700"
            onClick={onClose}
          >
            <IoMdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-start gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="taskTitle">Title</label>
              <input
                type="text"
                id="taskTitle"
                className="border w-full p-2 border border-purple-600 rounded-lg"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="taskDueDate">Select Due Date:</label>

              <input
                type="date"
                id="taskDueDate"
                className="border w-full bg-white p-2 border border-purple-600 rounded-lg"
                {...register("dueDate", {
                  required: "Due date is required",
                  validate: isFutureDate,
                })}
              />
            </div>
            {pId != null && <input type="hidden" {...register("projectId")} />}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-purple-200 hover:bg-purple-700 flex items-center gap-2"
              disabled={isSubmitting}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
