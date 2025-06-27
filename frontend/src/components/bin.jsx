import { useState, useEffect, useRef } from "react";
import { useMyContext } from "../context/Context";
import ScrollItem from "./scrollItem";
import { showError, showSuccess } from "../components/toaster";
import api from "../service/apiService";
import { FaEllipsis } from "react-icons/fa6";
import { Loader, useClickOutside } from "./item";
import { vibratePhone } from "../service/vibrate";

export default function Bin() {
  const { isMobile } = useMyContext();

  const [visibleTaskOpt, setVisibleTaskOpt] = useState(null);
  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [select, setSelect] = useState(false);
  const [droppedTasks, setDroppedTasks] = useState([]);

  const dropdownRef = useRef(null);
  const ellipsisRef = useRef(null);

  const showDroppedTasks = async () => {
    try {
      const response = await api.get("/task/dropped");
      // console.log(response);
      // return response.data.droppedTasks;
      setDroppedTasks(response.data.droppedTasks);
    } catch (error) {
      console.log(error);
    } finally {
      if (setLoader2) setLoader2(false);
    }
  };
  const deleteTasks = async (data) => {
    if (setLoader2) setLoader2(true);
    data = { id: data };
    try {
      const response = await api.post("/task/delete", data);
      console.log(response);
      // return response.data.droppedTasks;
      showDroppedTasks();
      showSuccess(response.data.message, isMobile);
      vibratePhone(200);
      setSelect(false);
      setSelectedTasks([]);
    } catch (error) {
      // console.log(error);
      showError(error.response?.data?.message || error.message, isMobile);
    } finally {
      if (setLoader2) setLoader2(false);
    }
  };
  const selectTasks = (id) => {
    setVisibleTaskOpt(null);
    if (selectedTasks.includes(id)) {
      setSelectedTasks((prev) => prev.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks((prev) => [...prev, id]);
    }
    setSelect(true);
  };

  useEffect(() => {
    const fetchData = () => {
      showDroppedTasks();
    };
    setLoader2(true);
    fetchData();
  }, []);
  useEffect(() => {
    if (selectedTasks.length === 0) {
      setSelect(false);
    }
  }, [selectedTasks]);

  useClickOutside(dropdownRef, ellipsisRef, () => {
    setVisibleTaskOpt(null);
  });

  return (
    <div className="h-full">
      <div className="w-full flex justify-end items-center px-6">
        {select && (
          <div
            className="flex items-center gap-2"
            onClick={() => {
              deleteTasks(selectedTasks);
            }}
          >
            Delete
          </div>
        )}
      </div>
      <div className="mt-4 overflow-y-auto h-[500px] w-full px-6 py-2 ">
        {loader2 && <Loader type={2} />}
        {droppedTasks.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No dropped tasks to load
          </p>
        )}
        {droppedTasks.map((task) => (
          <ScrollItem
            onClick={select ? () => selectTasks(task._id) : undefined}
            styles={` cursor-pointer flex justify-between items-center p-2 w-full sm:w-[80%] lg:w-[60%] mx-auto mb-4 h-auto rounded-lg hover:shadow-lg shadow-md relative transition ${selectedTasks.includes(task._id) ? "bg-gray-100" : "bg-white"}`}
            key={task._id}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                {select && (
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-purple-700"
                    checked={selectedTasks.includes(task._id)}
                  />
                )}
                <h3 className="text-md font-semibold text-gray-800">
                  {task.title}
                </h3>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setVisibleTaskOpt(
                    task._id === visibleTaskOpt ? null : task._id,
                  );
                }}
                ref={ellipsisRef}
                className="p-1 text-purple-700 cursor-pointer"
              >
                <FaEllipsis />
              </span>
            </div>
            {task._id === visibleTaskOpt && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full w-[110px] rounded-md bg-gray-50 shadow-lg text-black z-10"
              >
                <ul className="flex flex-col text-center items-center gap-4 w-full">
                  <li className="hover:text-green-700 p-2 hover:bg-green-100 w-full transition">
                    Recover
                  </li>
                  <li
                    onClick={() => selectTasks(task._id)}
                    className="p-2 hover:text-purple-700 hover:bg-purple-100 w-full transition"
                  >
                    Select
                  </li>
                  <li
                    onClick={() => deleteTasks(task._id)}
                    className="hover:text-red-700 p-2 hover:bg-red-100 w-full transition"
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </ScrollItem>
        ))}

        {loader1 && <Loader type={3} />}
      </div>
    </div>
  );
}
