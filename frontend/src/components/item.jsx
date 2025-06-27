import React, { useEffect, useState } from "react";
import "../mystyle.css";

export const Loader = ({ type }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setShow(true), 10);
  }, []);
  return (
    <>
      {!type && (
        <div className="m-auto h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      )}
      {type === 2 && (
        <div
          className={`absolute top-10 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out
          ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 -translate-y-10"}`}
        >
          <div
            className="h-6 w-6 rounded-full border-[3px] border-t-transparent animate-spin"
            style={{
              animation:
                "spin 1s linear infinite, colorSpin 4s linear infinite",
            }}
          />
        </div>
      )}
      {type === 3 && (
        <div
          className="h-6 w-6 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{
            animation: "spin 1s linear infinite, colorSpin 4s linear infinite",
          }}
        ></div>
      )}
    </>
  );
};

export const useClickOutside = (ref, ignoreRef, onClickOutside) => {
  useEffect(() => {
    function handleClick(event) {
      const clickedInsideTarget = ref.current?.contains(event.target);
      const clickedInsideIgnore = ignoreRef?.current?.contains(event.target);

      if (!clickedInsideTarget && !clickedInsideIgnore) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onClickOutside]);
};

export const Indicator = ({ status }) => {
  console.log(status);
  if (status === "notStarted") {
    return (
      <span className="text-gray-700 font-medium flex items-center gap-1">
        <span className="inline-flex h-3 w-3 rounded-full bg-gray-400"></span>
        Not started
      </span>
    );
  } else if (status === "inProgress") {
    return (
      <span className="text-gray-700 font-medium flex items-center gap-1">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        In Progress
      </span>
    );
  } else if (status === "onHold") {
    return (
      <span className="text-gray-700 font-medium flex items-center gap-1">
        <span className="inline-flex h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></span>
        On Hold
      </span>
    );
  } else if (status === "stuck") {
    return (
      <span className="text-gray-700 font-medium flex items-center gap-1">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        Stuck
      </span>
    );
  } else if (status === "completed") {
    return (
      <span className="text-gray-700 font-medium flex items-center gap-1">
        <span className="inline-flex h-3 w-3 rounded-full bg-green-600"></span>
        Completed
      </span>
    );
  } else if (status === "cancelled") {
    return (
      <span className="text-gray-700 font-medium flex items-center gap-1">
        <span className="inline-flex h-3 w-3 rounded-full bg-gray-500 opacity-50"></span>
        Cancelled
      </span>
    );
  } else {
    return null;
  }
};

// export const Indicator = ({ status }) => {
//   console.log(status);
//   if (status === "notStarted") {
//     return (
//       <span className="text-gray-700 font-medium flex items-center gap-1">
//         <span className="inline-flex h-3 w-3 rounded-full bg-gray-400"></span>
//         Not started
//       </span>
//     );
//   } else if (status === "inProgress") {
//     return (
//       <span className="text-gray-700 font-medium flex items-center gap-1">
//         <span className="relative flex h-3 w-3">
//           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//           <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//         </span>
//         In Progress
//       </span>
//     );
//   } else if (status === "onHold") {
//     return (
//       <span className="inline-flex h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></span>
//     );
//   } else if (status === "stuck") {
//     return (
//       <span className="relative flex h-3 w-3">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//       </span>
//     );
//   } else if (status === "completed") {
//     return (
//       <span className="inline-flex h-3 w-3 rounded-full bg-green-600"></span>
//     );
//   } else if (status === "cancelled") {
//     return (
//       <span className="inline-flex h-3 w-3 rounded-full bg-gray-500 opacity-50"></span>
//     );
//   } else {
//     return null;
//   }
// };
