import type { QueryClient } from "@tanstack/react-query";

export interface RouteHandle {
    hydrate?: (queryClient: QueryClient, data: unknown) => void;
}
