import React, { Suspense } from "react";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";

import { User } from "./contexts/User";
import { Faves } from "./contexts/Faves";

import App from "./components/App.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/artouch">
    <Suspense fallback="...is loading">
      <User>
        <Faves>
          <App />
        </Faves>
      </User>
    </Suspense>
  </BrowserRouter>
);
