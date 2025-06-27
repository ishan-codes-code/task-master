import Calendar from "./calendar";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import Modal from "./modals";
import { Navbar2 } from "./navbar";
import ShowTask from "./showTask";
import { fetchTask } from "../functions/operateTasks";
import { IoMdClose } from "react-icons/io";
import { MdDelete, MdModeEdit } from "react-icons/md";
import api from "../service/apiService";
import { showError, showSuccess } from "../components/toaster";
import { useMyContext } from "../context/Context";
import { formatDateWithLabels } from "../functions/operateDates";

export default function Dashboard() {
  const { isMobile, tasksData, setTasksData } = useMyContext();
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
    <div className="h-full w-full flex md:flex-row flex-col  ">
      <div className="px-6 overflow-auto w-full">
        <Navbar2 />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-2  sm:p-4">
            <p className="text-sm text-purple-700">Total Tasks</p>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
              {tasksData.total}
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

        <div>
          <div className="flex justify-between items-center my-4">
            <h3 className="text-md font-semibold text-gray-500">My Tasks</h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-100 hover:text-purple-700 transition"
            >
              <FaPlus />
            </button>
          </div>

          {showTaskCon && (
            <ShowTask
              setOperateTask={setOperateTask}
              setShowRightCon={setShowRightCon}
              hasMore={hasMore}
              setHasMore={setHasMore}
              setPage={setPage}
              page={page}
            />
          )}
          {!showTaskCon && (
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
          )}
        </div>
      </div>
      <div
        className={
          showRightCon === 1
            ? "md:w-[50%] h-full w-full absolute z-40 md:static px-6 py-4 flex flex-col items-center overflow-auto bg-white/70 backdrop-blur-md shadow-lg"
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
      <div
        className={
          showRightCon === 2
            ? "md:w-[50%] h-screen w-full absolute z-40 md:static px-6 py-4 flex flex-col items-center overflow-auto bg-white/70 backdrop-blur-md shadow-lg"
            : "hidden"
        }
      >
        <div className="flex items-center w-full justify-between">
          <h3 className="text-lg font-semibold">Task Overview</h3>
          <button
            onClick={() => {
              setOperateTask([]);
              setShowRightCon();
            }}
            className="text-black text-2xl hover:text-gray-700"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="w-full my-6 flex flex-col gap-6">
          <div className="relative border border-purple-600 w-full p-4">
            <h4 className="text-sm font-medium absolute -top-2 bg-white">
              Title
            </h4>
            <p className="capitalize">{operateTask.title}</p>
          </div>
          <div className="relative border border-purple-600 w-full p-4 ">
            <h4 className="text-sm font-medium absolute -top-2 bg-white">
              Description
            </h4>
            <p className="capitalize">
              {operateTask.desc ? operateTask.desc : "No Description"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 lg:px-4 rounded-md font-medium flex items-center gap-2 transition"
              to="/signup"
              onClick={() => {
                dropTask(operateTask._id);
              }}
            >
              <MdDelete />
              Drop
            </button>
            <button
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 lg:px-4 rounded-md font-medium flex items-center gap-2 transition"
              onClick={() => {
                setShowModal(true);
                setEditTask({
                  isEditing: true,
                  data: operateTask,
                });
              }}
            >
              <MdModeEdit />
              Edit
            </button>
          </div>
        </div>
        {operateTask._id}
      </div>

      <Modal
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
