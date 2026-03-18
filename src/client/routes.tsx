import { AppRoute } from "@shared/routes";
import type { RouteObject } from "react-router";

import { App } from "./App";

const components = {
    [AppRoute.Homepage]: () => import("./views/Homepage"),
};

export const routes: RouteObject[] = [
    {
        Component: App,
        children: Object.entries(components).map<RouteObject>(([path, lazy]) => ({
            path,
            lazy,
        })),
    },
];
