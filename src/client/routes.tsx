import { PageRoute } from "@shared/routes";
import type React from "react";
import type { RouteObject } from "react-router";

import { App } from "./App";

const isBrowser = typeof window !== "undefined";

const components: Record<PageRoute, () => Promise<{ Component: React.FC }>> = {
    [PageRoute.Homepage]: () => import("./views/Homepage"),
    [PageRoute.TodoList]: () => import("./views/Todo"),
};

const loaders: Partial<Record<PageRoute, () => Promise<unknown>>> = {
    [PageRoute.TodoList]: async () => {
        const { getList } = await import("./services/todo.service");

        return getList();
    },
};

export const routes: RouteObject[] = [
    {
        Component: App,
        children: Object.entries(components).map<RouteObject>(([path, lazy]) => ({
            id: path,
            path,
            lazy,
            loader: isBrowser ? loaders[path as PageRoute] : undefined,
        })),
    },
];
