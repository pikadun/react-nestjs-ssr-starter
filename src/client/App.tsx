import { MantineProvider } from "@mantine/core";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import type { StaticHandlerContext } from "react-router";
import { RouterProvider, StaticRouterProvider } from "react-router";

interface BaseAppProps {
    queryClient: QueryClient;
    router: React.ComponentProps<typeof RouterProvider>["router"];
}

interface ClientAppProps extends BaseAppProps {
    context?: never;
}

interface SSRAppProps extends BaseAppProps {
    context: StaticHandlerContext;
}

type AppProps = ClientAppProps | SSRAppProps;

export const App: React.FC<AppProps> = ({ queryClient, router, context }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider defaultColorScheme="auto">
                {context
                    ? <StaticRouterProvider router={router} context={context} hydrate={false} />
                    : <RouterProvider router={router} />}
            </MantineProvider>
        </QueryClientProvider>
    );
};
