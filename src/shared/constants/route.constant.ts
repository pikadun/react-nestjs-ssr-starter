export const PageRoute = {
    Homepage: "/",
    TodoList: "/todo",
} as const;

export type PageRoute = typeof PageRoute[keyof typeof PageRoute];
