import type { RouteHandle } from "@shared/types/route";
import type { RenderApp, RenderAppOptions } from "@shared/types/ssr";
import { dehydrate } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, type StaticHandler } from "react-router";

import { App, createQueryClient } from "../App";
import { routes } from "../routes";

let cachedHandler: StaticHandler | null = null;

const getStaticHandler = (basename: string) => {
    cachedHandler ??= createStaticHandler(routes, { basename });
    return cachedHandler;
};

export const renderApp: RenderApp = async (options: RenderAppOptions) => {
    const { basename = "/", prefetchedData, request } = options;
    const handler = getStaticHandler(basename);
    const context = await handler.query(request);

    // TODO: handle redirect
    if (context instanceof Response || context.statusCode === 404) {
        return null;
    }

    const queryClient = createQueryClient();

    if (prefetchedData) {
        for (const match of context.matches) {
            const handle = match.route.handle as RouteHandle | undefined;
            handle?.hydrate?.(queryClient, prefetchedData);
        }
    }

    const dehydratedState = dehydrate(queryClient);
    const router = createStaticRouter(handler.dataRoutes, context);

    const html = renderToString(
        <App queryClient={queryClient} router={router} context={context} />,
    );

    return { html, dehydratedState };
};
