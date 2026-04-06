// 触发各页面的 hydration 注册（副作用导入）
import "./services/todo.client";

import type { RenderApp, RenderAppOptions } from "@shared/types/ssr";
import { dehydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, type StaticHandler, StaticRouterProvider } from "react-router";

import { routes } from "./routes";
import { getSSRHydration } from "./services/ssr-hydration";

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

    const queryClient = new QueryClient();

    if (prefetchedData) {
        for (const match of context.matches) {
            const hydration = match.route.id ? getSSRHydration(match.route.id) : undefined;
            if (hydration) {
                queryClient.setQueryData(hydration.queryKey, prefetchedData);
            }
        }
    }

    const dehydratedState = dehydrate(queryClient);
    const router = createStaticRouter(handler.dataRoutes, context);

    const html = renderToString(
        <QueryClientProvider client={queryClient}>
            <StaticRouterProvider router={router} context={context} />
        </QueryClientProvider>,
    );

    return { html, dehydratedState };
};
