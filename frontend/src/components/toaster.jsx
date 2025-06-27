import { toast as sonnerToast } from "sonner";
import { toast as hotToast } from "react-hot-toast";

export const showError = (msz, isMobile) => {
  // if (isMobile) {
  //   hotToast.error(msz, { duration: 2000 });
  // } else {
  sonnerToast.error(msz, {
    duration: 2000,
    style: { backgroundColor: "#EF4444", color: "white" },
  });
  // }
};
export const showSuccess = (msz, isMobile) => {
  // if (isMobile) {
  //   hotToast.success(msz, { duration: 2000 });
  // } else {
  sonnerToast.success(msz, {
    duration: 2000,
    style: { backgroundColor: "#10B981", color: "white" },
  });
  // }
};
// export function Toaster() {
//   const { isMobile } = useDevice();

//   const showToast = () => {
//     if (isMobile) {
//       hotToast("Custom small toast for mobile!", { duration: 2000 });
//     } else {
//       sonnerToast("Custom small toast for pc!", {
//         duration: 2000,
//        style: { backgroundColor: "red", color: "white" },
//       });
//     }
//   };

//   return (
//     <>
//       <button onClick={showToast}>Show toast</button>
//       <ToasterStyles />
//     </>
//   );
// }
