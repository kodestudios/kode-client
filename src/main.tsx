import React from "react";
import ReactDOM from "react-dom/client";
import {
    RouterProvider,
    createHashHistory,
    createRouter
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { initializeTheme } from "@/features/themes";
import "./index.css";

// Sync the persisted (or default) theme to `:root` *before* React mounts so
// the very first paint already uses the correct palette — no flash.
initializeTheme();

const hashHistory = createHashHistory();
const router = createRouter({ routeTree, history: hashHistory });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
