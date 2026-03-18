import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";

import { routes } from "./routes";

export interface RenderAppOptions {
    basename?: string;
    entry?: string;
    request: Request;
}

const handler = createStaticHandler(routes);

export const renderApp = async (options: RenderAppOptions) => {
    const { request } = options;
    const context = await handler.query(request);

    // TODO: handle redirect
    if (context instanceof Response || context.statusCode === 404) {
        return null;
    }

    const router = createStaticRouter(handler.dataRoutes, context);

    return renderToString(
        <StaticRouterProvider router={router} context={context} />,
    );
};
