import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import Modal from "./modals";
import ShowTask from "./showTask";
import { fetchTask } from "../functions/operateTasks";
import api from "../service/apiService";
import { showError, showSuccess } from "../components/toaster";
import { useMyContext } from "../context/Context";
import { IoMdClose } from "react-icons/io";
import { MdDelete, MdModeEdit } from "react-icons/md";
import TaskOverview from "./taskOverview";
import TaskModal from "./taskModal";
import TaskBoard from "./taskBoard";

export default function Tasks() {
  const { isMobile, tasksData, setTasksData, tasks } = useMyContext();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [operateTask, setOperateTask] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTaskCon, setShowTaskCon] = useState(true);
  const [showRightCon, setShowRightCon] = useState();
  const [editTask, setEditTask] = useState({
    isEditing: false,
    data: {},
  });
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (hasMore === false && tasksData.tasks.length === 0) {
      setShowTaskCon(false);
    } else {
      setShowTaskCon(true);
    }
  }, [page, hasMore]);

  const dropTask = async (id) => {
    try {
      const response = await api.patch(`/task/drop?id=${id}`);
      showSuccess(response.data.message, isMobile);
      setOperateTask([]);
      setShowRightCon();
    } catch (error) {
      showError(error.response?.data?.message || error.message, isMobile);
    } finally {
      setTasksData({
        tasks: [],
        total: 0,
        completed: 0,
      });
      fetchTask(1, setTasksData, setHasMore);
      setPage(1);
    }
  };

  return (
    <div className="h-screen w-full flex md:flex-row flex-col">
      <div
        className={`px-6 py-4 flex-1 transition-[min-width] overflow-y-auto ${
          showRightCon
            ? "md:min-w-[70%] lg:min-w-[65%] min-w-md-lg"
            : "md:min-w-[100%] lg:min-w-[100%] min-w-full-md-lg"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 shadow-sm flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> <p>New Task</p>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm text-gray-700"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm text-gray-700"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="deadline">Deadline</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>
        </div>
        {/* {showTaskCon && (
          <ShowTask
            setOperateTask={setOperateTask}
            setShowRightCon={setShowRightCon}
            hasMore={hasMore}
            setHasMore={setHasMore}
            setPage={setPage}
            page={page}
            status={status}
            sort={sort}
          />
        )} */}
        {/* {!showTaskCon && (
          <div className="w-full flex flex-col items-center gap-2">
            <p>
              No <span className="text-red-700">incomplete</span> task found{" "}
            </p>
            <button
              onClick={() => {
                setShowModal(true);
                setEditTask({
                  isEditing: false,
                  data: {},
                });
              }}
              className={
                showTaskCon
                  ? "hidden"
                  : "bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition w-full max-w-sm"
              }
            >
              Start Working
            </button>
          </div>
        )} */}
        <TaskBoard
          tasks={tasks}
          setOperateTask={setOperateTask}
          setShowRightCon={setShowRightCon}
          showRightCon={showRightCon}
          operateTask={operateTask}
        />
        ;
      </div>

      {showRightCon === 2 && (
        <TaskOverview
          task={operateTask}
          setShowRightCon={setShowRightCon}
          setOperateTask={setOperateTask}
        />
      )}

      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask({
            isEditing: false,
            data: {},
          });
        }}
        setPage={setPage}
        setHasMore={setHasMore}
      />
    </div>
  );
}
