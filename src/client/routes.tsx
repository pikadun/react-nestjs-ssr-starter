import { PageRoute } from "@shared/routes";
import type { RouteHandle } from "@shared/types/route";
import type { LazyRouteFunction, RouteObject } from "react-router";

import { RootLayout } from "./layouts/RootLayout";

interface PageModule {
    Component: RouteObject["Component"];
    handle?: RouteHandle;
}

const lazyRoutes: Record<PageRoute, LazyRouteFunction<PageModule>> = {
    [PageRoute.Homepage]: () => import("./views/Homepage"),
    [PageRoute.TodoList]: () => import("./views/todo/TodoPage"),
};

export const routes: RouteObject[] = [
    {
        Component: RootLayout,
        children: Object.entries(lazyRoutes).map<RouteObject>(([path, lazy]) => ({
            id: path,
            path,
            lazy,
        })),
    },
];
