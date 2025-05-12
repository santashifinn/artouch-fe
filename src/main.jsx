import React, { Suspense } from "react";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";

import { User } from "./contexts/User.jsx";

import App from "./components/App.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/museum-test">
    <Suspense fallback="...is loading">
      <User>
        <App />
      </User>
    </Suspense>
  </BrowserRouter>
);
