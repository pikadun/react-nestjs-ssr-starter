import React from "react";
import { hydrateRoot } from "react-dom/client";
import {
    createBrowserRouter,
    type LazyRouteFunction,
    matchRoutes,
    type RouteObject,
    RouterProvider,
} from "react-router";

import { routes } from "./routes";

const baseElement = document.querySelector("base");
const basename = baseElement?.getAttribute("href") ?? "/";
const root = document.querySelector("#root");

// Determine if any of the initial routes are lazy
const lazyMatches = matchRoutes(routes, window.location, basename)
    ?.filter(m => m.route.lazy && typeof m.route.lazy === "function");

// Load the lazy matches and update the routes before creating your router
// so we can hydrate the SSR-rendered content synchronously
if (lazyMatches?.length) {
    await Promise.all(
        lazyMatches.map(async (m) => {
            const routeModule = await (m.route.lazy as LazyRouteFunction<RouteObject>)();
            m.route.Component = routeModule.Component;
            m.route.lazy = undefined;
        }),
    );
}

const router = createBrowserRouter(routes, { basename, hydrationData: window.__staticRouterHydrationData });

if (root) {
    hydrateRoot(
        root,
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    );
}
