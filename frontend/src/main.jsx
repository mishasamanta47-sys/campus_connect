import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";




const savedTheme = window.localStorage.getItem("campus-theme");
document.documentElement.setAttribute("data-theme", savedTheme === "night" ? "night" : "day");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
