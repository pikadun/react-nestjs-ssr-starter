import { hydrate } from "@tanstack/react-query";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import {
    createBrowserRouter,
    type LazyRouteFunction,
    matchRoutes,
    type RouteObject,
} from "react-router";

import { App } from "../App";
import { routes } from "../routes";
import { createQueryClient } from "../utils/query-client";

const basename = window.__APP__.basePath;
const root = document.querySelector("#root");
const queryClient = createQueryClient();

hydrate(queryClient, window.__SSR_STATE__);

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

const router = createBrowserRouter(routes, { basename });

if (root) {
    hydrateRoot(
        root,
        <React.StrictMode>
            <App queryClient={queryClient} router={router} />
        </React.StrictMode>,
    );
}
