import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { API_BASE_URL } from "./config";
import "./index.css";

window.__API_BASE_URL__ = API_BASE_URL;

const savedTheme = window.localStorage.getItem("campus-theme");
document.documentElement.setAttribute("data-theme", savedTheme === "night" ? "night" : "day");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
