import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

export default function ToasterStyles() {
  return (
    <div>
      <HotToaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#10B981", // Green background for success
              color: "#fff", // White text
            },
          },
          error: {
            style: {
              background: "#Ef4444", // Red background for error
              color: "#fff", // White text
            },
          },
        }}
      />
      <SonnerToaster position="top-right" />
    </div>
  );
}
