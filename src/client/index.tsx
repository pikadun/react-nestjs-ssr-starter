import {
    type DehydratedState,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
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
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
});

const isDehydratedState = (value: unknown): value is DehydratedState => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return Array.isArray(candidate.queries) && Array.isArray(candidate.mutations);
};

const resolveDehydratedState = (): DehydratedState | undefined => {
    const hydrationData = window.__staticRouterHydrationData;
    const matchedRouteId = matchRoutes(routes, window.location, basename)
        ?.findLast(match => match.route.id)
        ?.route.id;

    if (!hydrationData || !matchedRouteId) {
        return undefined;
    }

    const loaderDataByRoute = hydrationData.loaderData as Record<string, unknown> | undefined;
    const dehydratedState = loaderDataByRoute?.[matchedRouteId];

    return isDehydratedState(dehydratedState) ? dehydratedState : undefined;
};

const dehydratedState = resolveDehydratedState();

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
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    <RouterProvider router={router} />
                </HydrationBoundary>
            </QueryClientProvider>
        </React.StrictMode>,
    );
}
