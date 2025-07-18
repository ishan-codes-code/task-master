import { useEffect, useState } from "react";
import ProjectModal from "./projectModal";
import { FaPlus } from "react-icons/fa6";
import { Loader, Indicator } from "./item";
import { useMyContext } from "../context/Context";
import { fetchProject } from "../functions/operateProject";
import { formatDateWithLabels } from "../functions/operateDates";
import { FaEllipsis } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { Plus, CalendarDays, MoreHorizontal, Clock } from "lucide-react";
import classNames from "classnames";

function ProjectCard({ project }) {
  const msLeft = new Date(project.dueDate) - new Date();

  const secLeft = Math.floor(msLeft / 1000);
  const minLeft = Math.floor(msLeft / (1000 * 60));
  const hrsLeft = Math.floor(msLeft / (1000 * 60 * 60));
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));

  const dueColor = classNames("text-black px-2 py-1 rounded text-xs", {
    "bg-red-500 text-white": daysLeft <= 3,
    "bg-yellow-400": daysLeft > 3 && daysLeft <= 7,
    "bg-green-500": daysLeft > 7,
  });
  const overDue = secLeft < 1;
  const dueText =
    (daysLeft >= 1 && `${daysLeft} days`) ||
    (hrsLeft >= 1 && `${hrsLeft} hours`) ||
    (minLeft >= 1 && `${minLeft} minutes`) ||
    (secLeft >= 1 && `${secLeft} seconds`) ||
    "expired";

  const borderClr = overDue
    ? "red-500"
    : (project.status === "notStarted" && "gray-400") ||
      (project.status === "inProgress" && "green-500") ||
      (project.status === "onHold" && "yellow-400") ||
      (project.status === "stuck" && "red-500") ||
      (project.status === "completed" && "green-600") ||
      (project.status === "cancelled" && "gray-500") ||
      "black";

  return (
    <NavLink to={`/project/${project._id}`}>
      <div
        key={project._id}
        className={`rounded-2xl border  p-4 shadow-sm hover:shadow-md transition flex flex-col gap-2 ${
          project.status === "notStarted"
            ? " bg-[linear-gradient(to_right,_#FFFFFF,_#f5f3ff,_#FFFFFF)] border-purple-300"
            : `border-${borderClr}`
        } ${
          overDue && "bg-[linear-gradient(to_right,_#FFFFFF,_#fef2f2,_#FFFFFF)]"
        } `}
      >
        {/* <!-- Title + Menu --> */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg sm:xl font-bold text-gray-800">
            {project.title}
          </h2>
          <button className="text-gray-400 hover:text-gray-600">
            <FaEllipsis />
          </button>
        </div>

        {/* <!-- Description --> */}
        <p className="text-sm font-semibold text-gray-500">{project.desc}</p>

        {/* <!-- Progress bar --> */}
        <div className="flex items-center gap-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`bg-${borderClr} h-full rounded-full transition-all duration-300`}
              style={{ width: `${project.percentageCompleted}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {project.percentageCompleted}%
          </span>
        </div>

        {/* <!-- Footer --> */}
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col gap-2 text-sm text-gray-500">
          {/* <!-- Avatars can be added -->*/}

          <div className="flex justify-between items-center gap-2">
            {!overDue && (
              <>
                <span className={dueColor}>Due in {dueText} </span>
                <span
                  className={`flex items-center gap-2 border border-${borderClr}  px-2 py-1 rounded-lg`}
                >
                  <Indicator status={project.status} />
                </span>
              </>
            )}
            {overDue && (
              <>
                <span className={dueColor}>
                  Overdue {formatDateWithLabels(new Date(project.dueDate))}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Tasks scheduled for Reschedule");
                  }}
                  className="inline-flex gap-1 items-center p-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-md shadow hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-300 transition active:scale-95"
                >
                  <Clock className="w-5 h-5" /> Reschedule
                </button>
              </>
            )}
          </div>
          <div className="self-center sm:self-auto flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-gray-400 " />
            <span className="text-xs">
              Created at:{" "}
              <span className="font-medium text-gray-700">
                {formatDateWithLabels(new Date(project.createdAt))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default function Project() {
  const { projectsData, setProjectsData, projects } = useMyContext();
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);

  return (
    <div className="h-full w-full flex md:flex-row flex-col">
      {loader && <Loader type={2} />}
      <div className="max-h-screen overflow-y-auto w-full bg-gray-50 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="group bg-purple-600 text-white rounded-xl px-4 py-2 hover:bg-purple-700 active:scale-95 transition flex items-center gap-1"
          >
            <Plus className="transform transition-transform duration-300 group-hover:rotate-90 " />
            New Project
          </button>
        </div>

        {/* Filter + Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm text-gray-700">
              <option>Status: All</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm text-gray-700">
              <option>Sort: Newest</option>
              <option>Deadline</option>
              <option>A-Z</option>
            </select>
          </div>
        </div>
        {/* Project List */}
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard project={project} />
          ))}
        </div>
        <ProjectModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          setLoading={setLoader}
        />
      </div>
    </div>
  );
}
