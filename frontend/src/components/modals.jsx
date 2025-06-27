import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { showError, showSuccess } from "../components/toaster";
import { useForm } from "react-hook-form";
import { useMyContext } from "../context/Context";
import api from "../service/apiService";

export default function Modal({
  isOpen,
  onClose,
  editTask,
  setHasMore,
  setPage,
}) {
  const { isMobile, setTasksData } = useMyContext();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (editTask.isEditing) {
      const task = editTask.data;
      setTitle(task.title || "");
      setDesc(task.desc || "");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      setIsComplete(task.isComplete || false);
    } else {
      setTitle("");
      setDesc("");
      setDueDate("");
      setIsComplete(false);
    }
  }, [editTask]);

  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [onClose]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    // sync form state with local state
    setValue("title", title);
    setValue("desc", desc);
    setValue("dueDate", dueDate);
    setValue("isCompleted", isComplete);
  }, [title, desc, dueDate, isComplete, setValue]);

  const isFutureDate = (value) => {
    if (!value) return true;
    const today = new Date();
    const inputDate = new Date(value);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate > today || "Please select a future date";
  };

  const onSubmit = async (data) => {
    try {
      let response;
      // console.log(data);
      if (editTask.isEditing) {
        const cleanData = { ...data };

        if (editTask.data.title === cleanData.title) {
          delete cleanData.title;
        }
        if (editTask.data.desc === cleanData.desc) {
          delete cleanData.desc;
        }
        if (editTask.data.dueDate) {
          if (editTask.data.dueDate.split("T")[0] === cleanData.dueDate) {
            delete cleanData.dueDate;
          }
        }
        if (
          Boolean(editTask.data.isComplete) === Boolean(cleanData.isComplete)
        ) {
          delete cleanData.isComplete;
        }
        // console.log(cleanData);
        if (Object.keys(cleanData).length === 0) {
          showError("No changes made", isMobile);
          return null;
        }
        console.log(cleanData);
        response = await api.put(
          `/task/update/${editTask.data._id}`,
          cleanData,
        );
      } else {
        response = await api.post("/task/add", data);
      }

      showSuccess(response.data.message, isMobile);

      // Reset task list
      setTasksData({
        tasks: [],
        total: 0,
        completed: 0,
      });
      setHasMore(true);

      setPage(1);
    } catch (error) {
      console.log("Failed:", error);
      showError(error.response?.data?.message || error.message, isMobile);
    } finally {
      onClose();
    }
  };

  Object.values(errors).forEach((error) => {
    showError(error?.message, isMobile);
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md sm:w-[80%] mx-4 p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editTask.isEditing ? "Edit Task" : "Add Task"}
          </h2>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between">
                <label htmlFor="taskDesc">Description</label>
                <p className="text-gray-400 text-xs">(Optional)</p>
              </div>
              <textarea
                id="taskDesc"
                className="border bg-white w-full p-2 h-[15vh] border border-purple-600 rounded-lg"
                {...register("desc", {
                  minLength: {
                    value: 3,
                    message: "Description must be at least 3 characters",
                  },
                })}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between">
                <label htmlFor="taskDueDate">Select Due Date:</label>
                <p className="text-gray-400 text-xs">(Optional)</p>
              </div>
              <input
                type="date"
                id="taskDueDate"
                className="border w-full bg-white p-2 border border-purple-600 rounded-lg"
                {...register("dueDate", {
                  validate: isFutureDate,
                })}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Completed Checkbox */}
            <div className="flex gap-2 items-center w-full">
              <input
                type="checkbox"
                id="isComplete"
                className="h-4 w-4"
                disabled={!editTask.isEditing}
                {...register("isCompleted")}
                checked={isComplete}
                onChange={(e) => setIsComplete(e.target.checked)}
              />

              <label
                htmlFor="isComplete"
                className={
                  editTask.isEditing
                    ? "text-black"
                    : "line-through text-gray-400"
                }
              >
                Completed
              </label>
            </div>
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
              {editTask.isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
