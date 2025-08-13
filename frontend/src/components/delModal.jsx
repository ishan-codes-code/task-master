import { useState } from "react";
import { motion } from "framer-motion";
import { useMyContext } from "../context/Context";
import api from "../service/apiService";
import { Loader } from "./item";
import { showError, showSuccess } from "./toaster";
import { TriangleAlert } from "lucide-react";

export const DelTasksModal = ({ taskId, onClose }) => {
  const { pTasks, setPTasks, setProjects } = useMyContext();
  const task = pTasks.find((t) => t._id === taskId);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log(`Deleting task with ID: ${taskId}`);
    setLoading(true);
    try {
      const response = await api.post("/project/deletePTasks", { taskId });
      setPTasks((prev) => prev.filter((t) => t._id !== taskId));
      setProjects((prev) => {
        return prev.map((project) => {
          if (project._id === task.projectId) {
            return {
              ...project,
              tasks: project.tasks.filter((t) => t._id !== taskId),
            };
          } else return project;
        });
      });
      showSuccess(response.data.message || "Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      showError(error.response?.data?.message || "Failed to delete task");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-h-[99vh] overflow-y-auto w-full max-w-2xl mx-auto my-8 p-8 rounded-3xl shadow-xl border border-gray-200 relative"
      >
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-lg font-semibold">Delete Task </h2>
          {loading && <Loader type={3} />}
        </div>

        {task ? (
          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete the following task?
            </p>
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">{task.description}</p>
            </div>
          </div>
        ) : (
          <p className="mb-6 text-gray-500">Loading task details...</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDelete();
            }}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition active:scale-95"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DelPojectModal = ({ project, onClose }) => {
  const { projects, setPTasks, setProjects } = useMyContext();
  const taskIds = project.tasks;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/project/delete`, project);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
      setPTasks((prev) => prev.filter((t) => !taskIds.includes(t._id)));
      showSuccess(response.data.message || "Project deleted successfully");
    } catch (error) {
      console.error("Error deleting Project:", error);
      showError(error.response?.data?.message || "Failed to delete Project");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 items-center bg-white max-h-[99vh] overflow-y-auto max-w-lg mx-auto my-8 p-8 rounded-3xl shadow-xl border border-gray-200 relative"
      >
        {loading && (
          <span className="self-end absolute">
            <Loader type={3} />
          </span>
        )}

        <span className="p-4 bg-red-100 text-red-700 rounded-full">
          <TriangleAlert className="h-8 w-8" />
        </span>
        <h2 className="text-xl font-bold">Are you sure?</h2>
        <p className="text-gray-600 font-semibold">
          This action cannot be undone. All values associated with this project
          will be lost
        </p>

        <button
          onClick={() => {
            handleDelete();
          }}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition active:scale-95 w-full"
        >
          Delete Project
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition active:scale-95 w-full"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};
