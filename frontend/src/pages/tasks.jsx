import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import Modal from "../components/modals";
import ShowTask from "../components/showTask";
import { fetchTask } from "../functions/operateTasks";
import api from "../service/apiService";
import { showError, showSuccess } from "../components/toaster";
import { useMyContext } from "../context/Context";
import { IoMdClose } from "react-icons/io";
import { MdDelete, MdModeEdit } from "react-icons/md";
import TaskOverview from "../components/taskOverview";
import TaskModal from "../components/taskModal";
import TaskBoard from "../components/taskBoard";
import { PlusCircle } from "lucide-react";
import CustomSelect from "../components/customSelect";

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
  const [status, setStatus] = useState("pending");

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
  const sortFunctions = [
    () => {
      setStatus("all");
    },
    () => {
      setStatus("pending");
    },
    () => {
      setStatus("completed");
    },
    () => {
      setStatus("expired");
    },
  ];
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
          <div className="">
            <CustomSelect
              options={["Status: All", "Pending", "Completed", "Expired"]}
              className={
                "px-3 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm text-gray-700 flex items-center justify-between min-w-[135px] gap-2 hover:border-purple-500 focus:outline-none"
              }
              sortFunctions={sortFunctions}
            />
          </div>
        </div>
        {tasks.length > 0 ? (
          <TaskBoard
            tasks={tasks}
            setOperateTask={setOperateTask}
            setShowRightCon={setShowRightCon}
            showRightCon={showRightCon}
            operateTask={operateTask}
            status={status}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl shadow-md border border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
            <p className="text-gray-800 text-lg font-semibold mb-4">
              ☕ Looks like your to-do list went on a coffee break.
              <br />
              Want to add something?
            </p>
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:to-pink-600 transition shadow-lg"
              onClick={() => setShowModal(true)}
            >
              <PlusCircle size={20} />
              Add Task
            </button>
          </div>
        )}
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
