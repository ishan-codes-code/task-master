import Calendar from "../components/calendar";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import Modal from "../components/modals";
import { Navbar2 } from "../components/navbar";
import ShowTask from "../components/showTask";
import { fetchTask } from "../functions/operateTasks";
import { IoMdClose } from "react-icons/io";
import { MdDelete, MdModeEdit } from "react-icons/md";
import api from "../service/apiService";
import { showError, showSuccess } from "../components/toaster";
import { useMyContext } from "../context/Context";
import { formatDateWithLabels } from "../functions/operateDates";
import TaskModal from "../components/taskModal";
import TaskOverview from "../components/taskOverview";
import TaskBoard from "../components/taskBoard";

export default function Dashboard() {
  const { isMobile, tasksData, setTasksData, tasks } = useMyContext();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [operateTask, setOperateTask] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const formatted = formatDateWithLabels(selectDate);
  const [showTaskCon, setShowTaskCon] = useState(true);
  const [showRightCon, setShowRightCon] = useState();
  const [editTask, setEditTask] = useState({
    isEditing: false,
    data: {},
  });

  useEffect(() => {
    if (hasMore === false && tasksData.tasks.length === 0) {
      setShowTaskCon(false);
    } else {
      setShowTaskCon(true);
    }
  }, [page, hasMore]);
  useEffect(() => {
    setShowRightCon(1);
    if (isMobile) {
      setShowRightCon();
    }
  }, []);

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
    <div className="h-full w-full flex md:flex-row flex-col animate-fadeIn">
      <div
        className={`px-6 overflow-auto transition-[min-width] ${
          showRightCon ? "md:min-w-[70%]" : "md:min-w-[100%]"
        } `}
      >
        <Navbar2 />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-2  sm:p-4">
            <p className="text-sm text-purple-700">Total Tasks</p>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
              {tasks.length}
            </h2>
          </div>
          <div className="bg-green-50 border rounded-lg p-2  sm:p-4">
            <p className="text-sm text-green-500">Completed</p>
            <h2 className="text-xl sm:text-2xl font-bold text-green-800">
              {tasksData.completed}
            </h2>
          </div>
          <div className="bg-blue-50 border rounded-lg p-2  sm:p-4">
            <p className="text-sm text-blue-500">Active Projects</p>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800">0</h2>
          </div>
          <div className="bg-red-50 border rounded-lg p-2  sm:p-4">
            <p className="text-sm text-red-500">Due Soon</p>
            <h2 className="text-xl sm:text-2xl font-bold text-red-800">0</h2>
          </div>
        </div>

        <TaskBoard
          tasks={tasks}
          setOperateTask={setOperateTask}
          setShowRightCon={setShowRightCon}
          showRightCon={showRightCon}
          operateTask={operateTask}
          onlyDueSoon={true}
        />
      </div>
      <div
        className={
          showRightCon === 1
            ? "md:w-[100%] h-full w-full absolute z-40 md:static px-6 py-4 flex flex-col items-center overflow-auto bg-white/70 backdrop-blur-md"
            : "hidden"
        }
      >
        <div className="flex items-center w-full justify-between">
          <h3 className="text-lg font-semibold">Overview</h3>
          <button
            onClick={() => setShowRightCon()}
            className="text-black text-2xl hover:text-gray-700"
          >
            <IoMdClose />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Tasks for {formatted}
          </h3>
          <div>Feature not added</div>
        </div>
        <Calendar selectDate={selectDate} setSelectDate={setSelectDate} />
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
        editTask={editTask}
      />
    </div>
  );
}
