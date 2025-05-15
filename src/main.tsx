import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import React from "react";
import { LoadingSpinner } from "./components/LoadingSpinner.tsx";
import type { SpinnerProvider } from "./context/SpinnerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SpinnerProvider>
      <LoadingSpinner />
      <App />
    </SpinnerProvider>
  </React.StrictMode>
);
