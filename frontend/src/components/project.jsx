import { useEffect, useState } from "react";
import ProjectModal from "./projectModal";
import { FaPlus } from "react-icons/fa6";
import { Loader } from "./item";
import { useMyContext } from "../context/Context";
import { fetchProject } from "../functions/operateProject";
import { formatDateWithLabels } from "../functions/operateDates";
import { FaEllipsis } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { Plus, CalendarDays, MoreHorizontal } from "lucide-react";

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
            <NavLink to={`/project/${project._id}`}>
              <div
                key={project._id}
                className="rounded-2xl border border-gray-200 bg-[linear-gradient(to_right,_#FFFFFF,_#f5f3ff,_#FFFFFF)] p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition flex flex-col gap-2 "
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
                <p className="text-sm font-semibold text-gray-500">
                  {project.desc}
                </p>

                {/* <!-- Progress bar --> */}
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${project.percentageCompleted}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {project.percentageCompleted}%
                  </span>
                </div>

                {/* <!-- Footer --> */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  {/* <!-- Avatars --> */}
                  {/* <div className="flex -space-x-2">
                  <img
                    src="https://i.pravatar.cc/32?img=1"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://i.pravatar.cc/32?img=4"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://i.pravatar.cc/32?img=3"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                </div> */}

                  {/* <!-- Due Date --> */}
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-gray-400 " />
                    <span className="text-xs">
                      Due:{" "}
                      <span className="font-medium text-gray-700">
                        {" "}
                        {formatDateWithLabels(new Date(project.dueDate))}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </NavLink>
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
