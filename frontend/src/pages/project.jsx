import {
  Search,
  Clock,
  Plus,
  CalendarPlus,
  CalendarClock,
  CircleCheckBig,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useMyContext } from "../context/Context";
import classNames from "classnames";
import { useState, useEffect, useMemo } from "react";
import ProjectModal from "../components/projectModal";
import NothingToSee from "../components/nothingToSee";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import api from "../service/apiService";
import { showError, showSuccess } from "../components/toaster";
import { Loader } from "../components/item";
import { DelTasksModal, DelPojectModal } from "../components/delModal";
import Timer from "../components/timer";
import { updateTask } from "../functions/operateTasks";
import { calcPCompPct } from "../functions/operateProject";
import EllipsisDropdown from "../components/ellipse";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function ProjectsSidebar({
  projects,
  setShowPModal,
  selectedProject,
  openPDetails,
}) {
  return (
    <div className="bg-gray-100 h-full w-full pb-20 md:pb-0">
      <div className="">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 border-[1.5px] border-gray-300 p-2 rounded-xl focus-within:border-blue-500 transition m-4 bg-gray-100 w-full min-w-0">
            <Search className="text-gray-500" />
            <input
              type="text"
              className="bg-gray-100 outline-none flex-1 min-w-0"
              placeholder="Search"
            />
          </div>
          <button
            type="button"
            className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:to-pink-600 transition shadow-lg active:scale-95"
            onClick={() => setShowPModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-300 overflow-y-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => openPDetails(project)}
              className={classNames(
                "flex items-start gap-4 p-4 cursor-pointer",
                project._id === selectedProject?._id && "bg-white"
              )}
            >
              <img
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project._id}`}
                alt="Abstract shapes"
                loading="lazy"
                className="rounded-lg w-8 h-8"
              />
              <div>
                <h2 className="text-xl font-bold  relative leading-none">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-3">
                  {project.desc}
                </p>
                <div className="flex">
                  <span
                    className={classNames(
                      "flex items-center rounded-lg text-xs py-1 px-2 text-gray-500 bg-gray-200"
                    )}
                  >
                    <Clock className="w-4 h-4 text-gray-600 mr-1" /> 1 week left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <button onClick={() => setSelectedProject({})}>B</button> */}
      </div>
    </div>
  );
}

function TasksCon({ task, setDelTaskModal }) {
  const { pTasks, setPTasks } = useMyContext();
  const [loading, setLoading] = useState(false);

  const handleCompleted = () => {
    updateTask(
      task._id,
      { isCompleted: !task.isCompleted },
      undefined,
      setLoading,
      setPTasks
    );
  };

  return (
    <motion.li
      key={task._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex items-center justify-between border lg:border-0 hover:bg-gray-100 py-2 px-3 rounded-xl transition group "
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={task.isCompleted}
          onClick={() => handleCompleted()}
          disabled={loading}
          className="flex items-center justify-center rounded-full transition-all"
        >
          <AnimatePresence mode="wait">
            {task.isCompleted ? (
              <motion.span
                key={"tick"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <CircleCheckBig className="text-purple-600 h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key={"notTick"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className="border border-gray-400 bg-gray-100 h-5 w-5 rounded-full"
              />
            )}
          </AnimatePresence>
        </button>

        <span
          className={classNames(
            "text-md",
            task.isCompleted ? "line-through text-gray-400" : "text-gray-700"
          )}
        >
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <motion.div key={"delBtn"} layout>
          <button
            type="button"
            onClick={() => setDelTaskModal(task._id)}
            className="active:scale-90 lg:invisible lg:opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4 text-gray-600 " />
          </button>
        </motion.div>
        {loading && <Loader type={3} />}
      </div>
    </motion.li>
  );
}

function LeftSec({ project, setDelTaskModal, closeContent, openDelModal }) {
  const { pTasks, setPTasks, setProjects } = useMyContext();
  const percent = calcPCompPct(project._id);

  const options = [
    { label: "Close", onClick: closeContent },
    { label: "Delete", onClick: openDelModal },
  ];

  const currentPTasks = useMemo(
    () => pTasks.filter((t) => t.projectId === project._id),
    [pTasks, project._id]
  );
  const [isAddVisible, setAddVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/task/add", data);
      const updatedProject = response.data.project;
      console.log(response.data);
      showSuccess(response.data.message);

      setPTasks((prev) => [...prev, response.data.task]);
      setProjects((prev) => {
        return prev.map((project) => {
          if (project._id === updatedProject._id) {
            return {
              ...project,
              tasks: updatedProject.tasks,
            };
          } else return project;
        });
      });
      setAddVisible(false);
      reset();
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className=" h-auto overflow-y-auto py-4 px-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 cursor-pointer">
          <img
            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project._id}`}
            alt="Abstract shapes"
            loading="lazy"
            className="rounded-lg w-10 h-10"
          />
          <div>
            <h2 className="text-2xl font-bold  relative leading-none">
              {project.title}
            </h2>
          </div>
        </div>
        <EllipsisDropdown options={options} />
      </div>
      <div>
        <p className="text-gray-500 text-xs mb-3 font-medium">DETAILS</p>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 p-2 rounded-xl">
              <CalendarPlus className="text-blue-800 m-auto w-5 h-5" />
            </span>
            <div>
              <p className="text-gray-500 text-xs">Created At</p>
              <p className="font-semibold text-sm">
                {format(project.createdAt, "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-orange-100 p-2 rounded-xl">
              <CalendarClock className="text-orange-500 m-auto w-5 h-5" />
            </span>
            <div>
              <p className="text-gray-500 text-xs">End Date</p>
              <p className="font-semibold text-sm">
                {format(project.dueDate, "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
          <span></span>
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-xs mb-1 font-medium">DESCRIPTION</p>
        <p className="text-gray-700 text-sm font-semibold">{project.desc}</p>
      </div>
      <div className="lg:hidden">
        <p className="text-gray-500 text-xs font-medium mb-2">TIME REMAINING</p>
        <Timer date={project.dueDate} />
      </div>

      <div className="flex flex-col gap-2 ">
        <p className="text-gray-500 text-xs font-medium">TASKS ({percent}%)</p>
        {/* Progress Bar */}
        <div className="bg-gray-100 rounded-lg overflow-hidden h-2 mb-3">
          <div
            className="h-2 bg-gradient-to-r from-purple-600 to-purple-300 tasnsition-[width] duration-300 easeInOut"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        {/* Tasks */}

        <ul className="space-y-3">
          {currentPTasks.map((task) => (
            <TasksCon
              key={task._id}
              task={task}
              setDelTaskModal={setDelTaskModal}
            />
          ))}
        </ul>

        <AnimatePresence mode="wait">
          {isAddVisible ? (
            <motion.form
              layout
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center gap-8 overflow-hidden min-w-0"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter another task"
                  className="outline-none border-b-2 border-purple-600 ml-2 w-full pb-2"
                  {...register("title", {
                    required: "Task title is required",
                  })}
                />
                {isSubmitting && (
                  <span className="absolute bottom-1/2 right-0">
                    <Loader type={3} />
                  </span>
                )}
              </div>
              <input
                type="hidden"
                value={project._id}
                {...register("projectId")}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddVisible(false);
                    reset();
                  }}
                  className="sm:px-4 sm:py-1.5 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border active:scale-95 transition"
                >
                  <X className="sm:hidden" />
                  <p className="hidden sm:block">Cancel</p>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:px-4 sm:py-1.5 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-200 active:scale-95 transition disabled:cursor-not-allowed"
                >
                  <Check className="sm:hidden" />
                  <p className="hidden sm:block">Submit</p>
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              layout
              key="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              type="button"
              className="mt-3 text-sm text-purple-600 hover:underline self-start"
              onClick={() => setAddVisible(true)}
            >
              + Add another task
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RightSec({ project, closeContent, openDelModal }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="hidden lg:block px-4 py-4 space-y-5">
      <div>
        <p className="text-gray-500 text-xs font-medium mb-2">TIME REMAINING</p>
        <Timer date={project.dueDate} />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium mb-1">ACTIONS</p>
        <div>
          <button
            onClick={openDelModal}
            className="
           flex items-center pr-2 py-1 gap-2 text-sm active:scale-95 rounded-xl
           relative overflow-hidden bg-transparent cursor-pointer z-0 hover:text-red-500 transition-all font-semibold
           after:content-[''] after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:bg-red-100
           after:transition-all after:duration-300 after:ease-in-out after:-z-10
           hover:after:w-full
         "
          >
            <span className="text-red-500 bg-red-100 p-2 rounded-xl">
              <Trash2 className="w-4 h-4" />
            </span>
            Delete Project
          </button>
          <button
            onClick={closeContent}
            className="
           flex items-center pr-2 py-1 gap-2 text-sm active:scale-95 rounded-xl
           relative overflow-hidden bg-transparent cursor-pointer z-0 hover:text-gray-500 transition-all font-semibold
           after:content-[''] after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:bg-gray-100
           after:transition-all after:duration-300 after:ease-in-out after:-z-10
           hover:after:w-full
         "
          >
            <span className="text-gray-500 bg-gray-100 p-2 rounded-xl">
              <X className="w-4 h-4" />
            </span>
            Close
          </button>
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium mb-2">NOTES</p>
        <div className="bg-gray-100 p-4 rounded-lg text-gray-700 border active:scale-95">
          <p className="text-sm text-center">Add Notes</p>
        </div>
      </div>
    </div>
  );
}

function ProjectContent({ project, setDelTaskModal, closeContent }) {
  const [showProjDelModal, setShowProjDelModal] = useState();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute inset-0 md:static lg:grid lg:grid-cols-[65%,35%] bg-white divide-x divide-gray-300 h-full overflow-auto pb-20 md:pb-0"
    >
      <LeftSec
        project={project}
        setDelTaskModal={setDelTaskModal}
        closeContent={closeContent}
        openDelModal={() => setShowProjDelModal(project)}
      />
      <RightSec
        project={project}
        closeContent={closeContent}
        openDelModal={() => setShowProjDelModal(project)}
      />
      <AnimatePresence mode="wait">
        {showProjDelModal && (
          <DelPojectModal
            project={showProjDelModal}
            onClose={() => setShowProjDelModal()}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const { projects } = useMyContext();
  const [showPModal, setShowPModal] = useState(false);
  const [showDelTaskModal, setDelTaskModal] = useState("");
  const [selectedProject, setSelectedProject] = useState({});
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!selectedProject._id) return; // Don't run if modal is already closed

    if (searchParams.get("details") !== "true") {
      setSelectedProject({});
    }
  }, [searchParams]); // <-- only watch searchParams

  const openPDetails = (project) => {
    if (!project._id) return;
    setSelectedProject(project);

    const newParams = new URLSearchParams(searchParams); // clone
    newParams.set("details", "true");
    setSearchParams(newParams); // pass a new object
  };

  const closeDetails = () => {
    setSelectedProject({});

    const newParams = new URLSearchParams(searchParams); // clone
    newParams.delete("details");
    setSearchParams(newParams);
  };

  useEffect(() => {
    if (setSelectedProject) {
      setSelectedProject((prev) => {
        return projects.find((p) => p._id === prev._id) || {};
      });
    }
  }, [projects]);

  return (
    <div className="relative w-full h-screen md:grid md:grid-cols-[40%,60%] lg:grid-cols-[30%,70%] animate-fadeIn divide-x divide-gray-300 overflow-y-auto">
      <ProjectsSidebar
        projects={projects}
        setShowPModal={setShowPModal}
        selectedProject={selectedProject}
        openPDetails={openPDetails}
      />
      <AnimatePresence mode="wait">
        {selectedProject._id && (
          <ProjectContent
            project={selectedProject}
            setDelTaskModal={setDelTaskModal}
            closeContent={closeDetails}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {showPModal && (
          <ProjectModal
            isOpen={showPModal}
            onClose={() => {
              setShowPModal(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showDelTaskModal && (
          <DelTasksModal
            taskId={showDelTaskModal}
            onClose={() => setDelTaskModal("")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
