import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./output.css";
import "./mystyle.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context/Context";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>,
  // </StrictMode>,
);
