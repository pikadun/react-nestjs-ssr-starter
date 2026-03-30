import type { RenderApp, RenderAppOptions } from "@shared/types/ssr";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";

import { routes } from "./routes";

export const renderApp: RenderApp = async (options: RenderAppOptions) => {
    const { basename = "/", loaderData, request } = options;
    const handler = createStaticHandler(routes, { basename });
    const context = await handler.query(request);

    // TODO: handle redirect
    if (context instanceof Response || context.statusCode === 404) {
        return null;
    }

    // `matches` includes parent + child routes; choose the deepest match with an `id`.
    const routeId = context.matches.findLast(match => match.route.id)?.route.id;

    if (routeId) {
        context.loaderData = { [routeId]: loaderData };
    }

    const router = createStaticRouter(handler.dataRoutes, context);

    return renderToString(
        <StaticRouterProvider router={router} context={context} />,
    );
};
