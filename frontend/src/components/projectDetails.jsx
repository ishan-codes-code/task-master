import { useState, useEffect } from "react";
import { FaCheckCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { GrUploadOption } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { useMyContext } from "../context/Context";
import { formatDateWithLabels, isFutureDate } from "../functions/operateDates";
import api from "../service/apiService";
import { Loader, Indicator } from "./item";
import { showSuccess, showError } from "./toaster";
import { updateProject, deleteProject } from "../functions/operateProject";
import { FaEllipsis } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import TaskModal from "./taskModal";
import { format } from "date-fns";

export default function ProjectDetails() {
  const { id } = useParams();
  const {
    projectsData,
    setProjectsData,
    projects,
    setProjects,
    isMobile,
    pTasks,
    setPTasks,
  } = useMyContext();
  const navigate = useNavigate();

  const [project, setProject] = useState([]);

  const [currentPTasks, setCurrentPtasks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [moreOpt, setMoreOpt] = useState(false);
  const [percentageCompleted, setPercentageCompleted] = useState(0);

  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [dueDate, setDueDate] = useState(project.dueDate);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);

  useEffect(() => {
    const foundProject = projects?.find((p) => p._id === id);
    setProject(foundProject);
  }, [projects, id]);

  useEffect(() => {
    if (project) {
      setPTitle(project.title);
      setPDesc(project.desc);
      setDueDate(project.dueDate);
    }
  }, [project]);

  useEffect(() => {
    const foundPTasks = pTasks?.filter((t) => t.projectId === id);
    setCurrentPtasks(foundPTasks);
  }, [pTasks, id]);

  useEffect(() => {
    const completed = currentPTasks.filter((t) => t.isCompleted).length;
    setPercentageCompleted((completed / currentPTasks.length) * 100 || 0);
  }, [currentPTasks]);

  const toggleTask = async (taskId) => {
    if (project.status !== "inProgress") {
      showError("You can't edit tasks until the project is started.");
      return;
    }
    const task = currentPTasks.find((t) => t._id === taskId);

    const updatedTasks = currentPTasks.map((t) =>
      t._id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    const updatedCompletedCount = updatedTasks.filter(
      (t) => t.isCompleted
    ).length;
    const updatedPercentage =
      (updatedCompletedCount / updatedTasks.length) * 100;

    const data = { isCompleted: !task.isCompleted };

    setLoader(true);
    try {
      const response = await api.put(`/task/update/${taskId}`, data);
      const updatedTask = response.data.updatedTask;
      setPTasks((prev) => {
        return prev.map((t) => (t._id === updatedTask._id ? updatedTask : t));
      });
      showSuccess(response.data.message, isMobile);

      updateProject(
        project._id,
        {
          percentageCompleted: updatedPercentage,
        },
        setProjects
      );
    } catch (error) {
      console.log("Failed:", error);
      showError(error.response?.data?.message || error.message, isMobile);
    } finally {
      setLoader(false);
    }
  };

  const completedCount = currentPTasks.filter((t) => t.isCompleted).length;

  const handleSave = () => {
    const updates = {};
    if (pTitle !== project.title) {
      updates.title = pTitle;
    }
    if (pDesc !== project.desc) {
      updates.desc = pDesc;
    }
    if (dueDate !== project.dueDate.split("T")[0]) {
      updates.dueDate = dueDate;
    }
    if (Object.keys(updates).length > 0) {
      updateProject(project._id, updates, setProjects, setLoader);
    }
  };

  return (
    <>
      {loader && <Loader type={2} />}

      <div className="p-6 pt-0 space-y-6 max-w-6xl mx-auto max-h-screen overflow-y-auto">
        {/* Project Header */}
        <div className="flex justify-between items-center ">
          {/* <div>
            <h1
              contentEditable
              suppressContentEditableWarning
              className="text-2xl font-semibold text-gray-800"
              onBlur={(e) => {
                const newText = e.target.textContent.trim();
                setPTitle(newText);
              }}
            >
              {pTitle}
            </h1>

            <p className="text-sm text-gray-500">
              Due:{" "}
              {isEditingDueDate ? (
                <input
                  type="date"
                  value={new Date(dueDate).toISOString().split("T")[0]}
                  className="text-gray-600 text-sm border rounded px-2 py-1"
                  onBlur={(e) => {
                    if (e.target.value === project.dueDate.split("T")[0]) {
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
                  onChange={(e) => {
                    setDueDate(e.target.value);
                  }}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditingDueDate(true)}
                  className="text-gray-700 font-medium"
                >
                  {formatDateWithLabels(new Date(dueDate))}
                </span>
              )}
            </p>
          </div> */}
          <div className="flex gap-2 items-center">
            {(pTitle !== project.title ||
              pDesc !== project.desc ||
              (dueDate != project.dueDate && !isEditingDueDate)) && (
              <button
                onClick={handleSave}
                className="h-fit flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-100 hover:text-green-700 transition"
              >
                <GrUploadOption className="text-lg" /> Save
              </button>
            )}
            {project.status !== "inProgress" && (
              <button
                className="h-fit text-sm px-3 py-2 rounded-lg text-green-700 bg-green-100 border border-green-500 hover:bg-green-500 hover:text-white transition"
                onClick={() => {
                  updateProject(
                    project._id,
                    {
                      status: "inProgress",
                    },
                    setProjects,
                    setLoader
                  );
                }}
              >
                {project.status === "notStarted" && "Start Project"}
                {project.status === "onHold" && "Resume Project"}
              </button>
            )}
            {project.status === "inProgress" && (
              <button
                className="h-fit text-sm px-3 py-2 rounded-lg text-yellow-700 bg-yellow-100 border border-yellow-400 hover:bg-yellow-400 hover:text-white transition"
                onClick={() => {
                  updateProject(
                    project._id,
                    {
                      status: "onHold",
                    },
                    setProjects,
                    setLoader
                  );
                }}
              >
                Hold Project
              </button>
            )}

            <div className="relative">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreOpt(!moreOpt);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
              >
                <FaEllipsis />
              </span>
              {moreOpt && (
                <div className="absolute right-0 top-full w-[110px] rounded-md bg-white shadow-lg text-black z-10 cursor-pointer">
                  <ul className="flex flex-col text-center items-center gap-4 w-full">
                    <li
                      onClick={() =>
                        deleteProject(
                          project,
                          setLoader,
                          showSuccess,
                          showError,
                          setProjects,
                          navigate
                        )
                      }
                      className="hover:text-red-700 p-2 hover:bg-red-100 w-full transition"
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-2xl border p-4 shadow-sm">
          <h2
            contentEditable
            suppressContentEditableWarning
            className="text-2xl font-bold z-10 relative"
            onBlur={(e) => {
              const newText = e.target.textContent.trim();
              setPTitle(newText);
            }}
          >
            {pTitle}
          </h2>
          <p className="text-sm text-gray-500">
            Due:{" "}
            {isEditingDueDate ? (
              <input
                type="date"
                value={new Date(dueDate).toISOString().split("T")[0]}
                className="text-gray-600 text-sm border rounded px-2 py-1"
                onBlur={(e) => {
                  if (e.target.value === project.dueDate.split("T")[0]) {
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
                onChange={(e) => {
                  setDueDate(e.target.value);
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => setIsEditingDueDate(true)}
                className="text-gray-700 font-medium"
              >
                {dueDate && format(dueDate, "MMMM dd, yyyy")}
              </span>
            )}
          </p>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text-gray-600 text-sm"
            onBlur={(e) => {
              const newText = e.target.textContent.trim();
              setPDesc(newText);
            }}
          >
            {pDesc}
          </p>
          <div className="flex justify-between mt-4 text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-2">
              Status:
              <Indicator status={project.status} />
            </span>
          </div>
          <div class="flex justify-between text-sm text-gray-500">
            <span>{Math.round(percentageCompleted)}% Complete</span>
            <span>Due: </span>
          </div>
          <div class="bg-gray-100 rounded-lg overflow-hidden h-2 mb-3">
            <div
              class="h-2 bg-gradient-to-r from-purple-600 to-purple-300"
              style={{ width: `${percentageCompleted}%` }}
            ></div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="bg-gradient-to-br from-white to-[#F8F5F0]   rounded-2xl border p-4 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Tasks</h2>
            <button
              className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 transition"
              onClick={() => {
                if (project.status !== "inProgress") {
                  showError(
                    "You can't add tasks until the project is started."
                  );
                  return;
                }
                setShowModal(true);
              }}
            >
              <FaPlus />
            </button>
          </div>

          <ul className="space-y-3">
            {currentPTasks.map((task) => (
              <li
                key={task._id}
                className="flex items-center justify-between border border-gray-300 bg-transparent hover:bg-gray-100 p-3 rounded-xl cursor-pointer active:scale-95 transition"
                onClick={() => toggleTask(task._id)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTask(task._id)}
                  />

                  <span
                    className={`text-md ${
                      task.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                {task.isCompleted && (
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 text-right mt-1">
            {completedCount} of {currentPTasks.length} tasks completed
          </p>
        </div>
        <TaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          setProject={setProject}
          pId={id}
        />
      </div>
    </>
  );
}

// <div className="relative flex items-center space-x-2">
//   {/* Dot */}
//   <span className="relative flex h-3 w-3">
//     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//     <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//   </span>
//   <span className="text-sm text-gray-700">In Progress</span>
// </div>
