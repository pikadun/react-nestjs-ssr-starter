export const enum AppRouteName {
    Home = "Home",
    Todo = "Todo",
    CatchAll = "CatchAll",
}

export interface AppRoute {
    path: string;
    name: AppRouteName;
}

/**
 * Single source of truth for all page routes, consumed by both the
 * client-side Vue Router and the server-side SSR controller.
 *
 * - Client: mapped to Vue `RouteRecordRaw` entries with a static
 *   `componentMap` for lazy-loading (see `src/client/router.ts`).
 * - Server (catch-all): used to look up route metadata (e.g. `auth`)
 *   before rendering.
 * - Server (Page Controller): heavy pages may define their own NestJS
 *   controller for Guard / DTO / data-prefetch; those paths must stay
 *   in sync with entries here.
 */
export const APP_ROUTES: AppRoute[] = [
    { path: "/", name: AppRouteName.Home },
    { path: "/todo", name: AppRouteName.Todo },
    { path: "/:catchAll(.*)", name: AppRouteName.CatchAll },
];
