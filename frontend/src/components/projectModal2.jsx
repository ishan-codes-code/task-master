import React, { useEffect, useState } from "react";
import DragDropExample from "./dropBox";
import { IoMdClose } from "react-icons/io";
import { useMyContext } from "../context/Context";
import { fetchTask } from "../functions/operateTasks";
import { useForm } from "react-hook-form";
import { showError, showSuccess } from "./toaster";
import { isFutureDate } from "../functions/operateDates";
import api from "../service/apiService";

export default function ProjectModal2({ isOpen, onClose, setLoader }) {
  if (!isOpen) return null;

  const { isMobile, setProjects } = useMyContext();

  const [step, setStep] = useState(1);
  const [existingTasks, setExistingTasks] = useState(false);

  const { tasksData, setTasksData } = useMyContext();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [addTasks, setAddTasks] = useState([]);
  const [tFormData, setTFormData] = useState({ tTitle: "", tDesc: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setTFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const {
    register,
    trigger,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  Object.values(errors).forEach((error) => {
    showError(error?.message, isMobile);
  });

  useEffect(() => {
    setTasksData({
      tasks: [],
      total: 0,
      completed: 0,
    });
  }, []);
  useEffect(() => {
    setLoading(true);
    fetchTask(page, setTasksData, setHasMore, setLoading);
  }, [page]);

  const next = async () => {
    if (step === 1) {
      const isStepOneValid = await trigger(["pTitle", "pDesc", "pDueDate"]);
      if (!isStepOneValid) return;
    }

    if (step === 2) {
      const isStepTwoValid = targetItems.length > 0 || addTasks.length > 0;
      if (!isStepTwoValid) {
        showError("Please add at least one task", isMobile);
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prev = () => setStep((prev) => Math.max(prev - 1, 1));
  const addTask = async () => {
    const isStepTwoValid = tFormData.tTitle && tFormData.tDesc;
    if (!isStepTwoValid) {
      if (!tFormData.tTitle) {
        showError("Please enter task title", isMobile);
      }
      if (!tFormData.tDesc) {
        showError("Please enter task description", isMobile);
      }
      return;
    }
    const newTask = {
      _id: Date.now().toString(36),
      title: tFormData.tTitle,
      description: tFormData.tDesc,
    };
    setAddTasks([...addTasks, newTask]);
    showSuccess("Task added successfully", isMobile);
  };

  const onSubmit = async (data) => {
    if (setLoader) setLoader(true);
    try {
      const response = await api.post("/project/add", {
        ...data,
        tasks: targetItems,
        addTasks: addTasks,
      });

      showSuccess(response.data.message, isMobile);
      setProjects((prev) => [...prev, response.data.project]);
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || err.message, isMobile);
    } finally {
      if (setLoader) setLoader(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[51] flex items-center justify-center bg-black/50 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[95%]  relative sm:w-[80%] h-[80vh] mx-4 p-2 py-4 sm:p-4 animate-fade-in flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl text-semibold">Create Project</h3>
          <span className="p-1 text-xl" onClick={onClose}>
            <IoMdClose />
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="relative w-full h-full">
            {/* Step 1 */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out w-full h-full px-2 py-4 flex flex-col gap-4
            ${
              step === 1
                ? "opacity-100 relative"
                : "opacity-0 pointer-events-none"
            }`}
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="pTitle" className="font-semibold">
                  Give your project the Title:
                </label>
                <input
                  type="text"
                  id="pTitle"
                  className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  {...register("pTitle", {
                    required: "Project title is required",
                  })}
                />
              </div>
              <div className=" flex-1 flex flex-col gap-2">
                <label htmlFor="pDesc" className="font-semibold">
                  The Description:
                </label>
                <textarea
                  id="pDesc"
                  className="flex-1 w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  {...register("pDesc", {
                    required: "Project Description is required",
                  })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="pDate" className="font-semibold">
                  Project due date:
                </label>
                <input
                  type="date"
                  id="pDate"
                  className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white w-full"
                  {...register("pDueDate", {
                    required: "Due date is required",
                    validate: isFutureDate,
                  })}
                />
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out w-full h-full px-2 py-4 flex flex-col gap-4 
            ${
              step === 2
                ? "opacity-100 relative"
                : "opacity-0 pointer-events-none"
            }`}
            >
              <div className="flex justify-between items-center flex-wrap">
                <h3 className="font-semiblod text-center text-xl">Add Task</h3>
                <div className="flex gap-2 items-center bg-blue-50 w-fit px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id="existingTasks"
                    className="w-4 h-4 boder accent-blue-800 cursor-pointer"
                    onChange={() => setExistingTasks(!existingTasks)}
                  />
                  <label
                    htmlFor="existingTasks"
                    className="font-semibold text-blue-800 cursor-pointer"
                  >
                    Select from existing tasks
                  </label>
                </div>
              </div>
              <div
                className={
                  existingTasks ? "hidden" : "flex-1 flex flex-col gap-4"
                }
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="tTitle" className="font-semibold">
                    Task Title:
                  </label>
                  <input
                    type="text"
                    id="tTitle"
                    className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    name="tTitle"
                    value={tFormData.tTitle}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="tDesc" className="font-semibold">
                    Task Description:
                  </label>
                  <textarea
                    id="tDesc"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    name="tDesc"
                    value={tFormData.tDesc}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={addTask}
                  className="self-center px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                >
                  Add
                </button>
                {(targetItems.length > 0 || addTasks.length > 0) && (
                  <div className="w-full">
                    <h3>Added Task</h3>

                    <div className="flex flex-col gap-2 p-4 border w-full">
                      {targetItems.map((item) => {
                        return <div key={item._id}>{item.title}</div>;
                      })}
                      {addTasks.map((item) => {
                        return <div key={item._id}>{item.title}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
              {existingTasks && (
                <DragDropExample
                  hasMore={hasMore}
                  page={page}
                  setPage={setPage}
                  loading={loading}
                  setLoading={setLoading}
                  sourceItems={sourceItems}
                  setSourceItems={setSourceItems}
                  targetItems={targetItems}
                  setTargetItems={setTargetItems}
                />
              )}
            </div>

            {/* Step 3 */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out w-full h-full px-2 py-4 flex flex-col gap-4 
              ${
                step === 3
                  ? "opacity-100 relative"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <h3 className="font-semiblod text-xl text-center">Overview</h3>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                <p className="font-semibold text-purple-800">Project Title:</p>
                <p>{getValues("pTitle")}</p>
              </div>
              <div className="flex gap-2 bg-gray-50 p-1 rounded-md">
                <p className="font-semibold text-green-800">
                  Project Description:
                </p>
                <p>{getValues("pDesc")}</p>
              </div>
              <div className="flex bg-gray-50 p-1 rounded-md gap-2">
                <p className="font-semibold text-red-800">Project Due Date:</p>
                <p>{getValues("pDueDate")}</p>
              </div>
              <div className="flex flex-col bg-gray-50 p-1 rounded-md gap-2">
                <p className="font-semibold text-blue-800">Selected Tasks:</p>
                <div className="flex flex-col gap-2  w-full">
                  {targetItems.map((item) => {
                    return <div key={item._id}>{item.title}</div>;
                  })}
                  {addTasks.map((item) => {
                    return <div key={item._id}>{item.title}</div>;
                  })}
                </div>
              </div>

              {/* <div>
                <p className="text-red-600">
                  Task priority order:{" "}
                  <sup className="text-gray-400">Optional</sup>
                </p>
                <PriorityOrder
                  targetItems={targetItems}
                  setTargetItems={setTargetItems}
                />
              </div> */}
            </div>

            {/* Navigation */}
          </div>
          <div className="w-full flex justify-between px-4">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Back
            </button>
            {step != 3 && (
              <button
                type="button"
                onClick={next}
                disabled={step === 3}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
