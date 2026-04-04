import { PageRoute } from "@shared/routes";
import type { ListTodosResponse } from "@shared/schemas/todo.schema";
import type { RenderApp, RenderAppOptions } from "@shared/types/ssr";
import { dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";

import { routes } from "./routes";
import { todoQueryKeys } from "./services/todo.client";

export const renderApp: RenderApp = async (options: RenderAppOptions) => {
    const { basename = "/", loaderData, request } = options;
    const handler = createStaticHandler(routes, { basename });
    const context = await handler.query(request);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });

    // TODO: handle redirect
    if (context instanceof Response || context.statusCode === 404) {
        return null;
    }

    // `matches` includes parent + child routes; choose the deepest match with an `id`.
    const routeId = context.matches.findLast(match => match.route.id)?.route.id;

    if (routeId === PageRoute.TodoList && loaderData) {
        queryClient.setQueryData<ListTodosResponse>(todoQueryKeys.list(), loaderData as ListTodosResponse);
    }

    const dehydratedState = dehydrate(queryClient);

    if (routeId) {
        context.loaderData = { [routeId]: dehydratedState };
    }

    const router = createStaticRouter(handler.dataRoutes, context);

    return renderToString(
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <StaticRouterProvider router={router} context={context} />
            </HydrationBoundary>
        </QueryClientProvider>,
    );
};
