import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installConsoleFilters } from "./lib/consoleFilters";
import "./index.css";

installConsoleFilters();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
