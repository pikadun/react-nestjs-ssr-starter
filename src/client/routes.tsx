import { PageRoute } from "@shared/routes";
import type React from "react";
import type { RouteObject } from "react-router";

import { App } from "./App";

const components: Record<PageRoute, () => Promise<{ Component: React.FC }>> = {
    [PageRoute.Homepage]: () => import("./views/Homepage"),
    [PageRoute.TodoList]: () => import("./views/Todo"),
};

export const routes: RouteObject[] = [
    {
        Component: App,
        children: Object.entries(components).map<RouteObject>(([path, lazy]) => ({
            id: path,
            path,
            lazy,
        })),
    },
];
