import {
  Search,
  Clock,
  Plus,
  Ellipsis,
  CalendarPlus,
  CalendarClock,
  CircleCheckBig,
  Trash2,
} from "lucide-react";
import { useMyContext } from "../context/Context";
import classNames from "classnames";
import { useState } from "react";
import ProjectModal from "../components/projectModal";
import NothingToSee from "../components/nothingToSee";
import { format } from "date-fns";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

function TasksCon({ task }) {
  const [completed, setCompleted] = useState(task.isCompleted);

  return (
    <li className="flex items-center justify-between hover:bg-gray-100 py-2 px-3 rounded-xl transition group ">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          onClick={() => setCompleted(!completed)}
          className="flex items-center justify-center  rounded-full transition-all"
        >
          {completed ? (
            <CircleCheckBig className="text-purple-600 h-5 w-5" />
          ) : (
            <span className="border border-gray-400 bg-gray-100 h-5 w-5 rounded-full" />
          )}
        </button>

        <span
          className={classNames(
            "text-md",
            completed ? "line-through text-gray-400" : "text-gray-700"
          )}
        >
          {task.title}
        </span>
      </div>

      <button
        type="button"
        className="active:scale-90 invisible opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4 text-gray-600 " />
      </button>
    </li>
  );
}

function LeftSec({ project }) {
  const { pTasks } = useMyContext();
  const currentPTasks = pTasks.filter((t) => t.projectId === project._id);
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeForm = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 400); // match animation duration
  };

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

  return (
    <div className=" h-full overflow-y-auto py-4 px-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 cursor-pointer">
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
        <Ellipsis className="cursor-pointer text-gray-500" />
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
        <p className="text-gray-500 text-sm font-semibold">{project.desc}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-500 text-xs font-medium">
          TASKS ({project.percentageCompleted}%)
        </p>
        {/* Progress Bar */}
        <div class="bg-gray-100 rounded-lg overflow-hidden h-2 mb-3">
          <div
            className="h-2 bg-gradient-to-r from-purple-600 to-purple-300"
            style={{ width: `${project.percentageCompleted}%` }}
          ></div>
        </div>
        {/* Tasks */}
        <ul>
          {currentPTasks.map((task) => (
            <TasksCon key={task._id} task={task} />
          ))}
        </ul>
        <AnimatePresence mode="wait">
          {showModal ? (
            <motion.form
              key="form"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center gap-8 overflow-hidden min-w-0"
            >
              <input
                type="text"
                placeholder="Enter another task"
                className="outline-none border-b-2 border-purple-600 ml-2 w-full pb-2"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-200 active:scale-95 transition"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              key="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              type="button"
              className="mt-3 text-sm text-purple-600 hover:underline self-start"
              onClick={() => setShowModal(true)}
            >
              + Add another task
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProjectsSidebar({
  projects,
  setShowModal,
  selectedProject,
  setSelectedProject,
}) {
  return (
    <div className="bg-gray-100 h-full overflow-y-auto">
      <div className="">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 border-[1.5px] border-gray-300 p-2 rounded-xl focus-within:border-blue-500 transition m-4 bg-gary-100">
            <Search className="text-gray-500" />
            <input
              type="text"
              className="bg-gray-100 outline-none"
              placeholder="Search"
            />
          </div>
          <button
            type="button"
            className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:to-pink-600 transition shadow-lg active:scale-95"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-300 overflow-y-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => setSelectedProject(project)}
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
        <button onClick={() => setSelectedProject({})}>B</button>
      </div>
    </div>
  );
}

function ProjectContent({ project }) {
  return <LeftSec project={project} />;
}

export default function Projects() {
  const { projects } = useMyContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});

  return (
    <div className="bg-white w-full h-screen grid md:grid-cols-[30%,70%] pb-20 sm:pb-0">
      <ProjectsSidebar
        projects={projects}
        setShowModal={setShowModal}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      {selectedProject._id ? (
        <ProjectContent project={selectedProject} />
      ) : (
        <NothingToSee />
      )}

      <ProjectModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </div>
  );
}
