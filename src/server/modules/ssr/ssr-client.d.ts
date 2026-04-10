/**
 * Ambient module declaration for the client-side SSR entry.
 *
 * This provides type information for "@client/entries/ssr" without resolving
 * the actual source file, so the server project doesn't pull in client-side
 * dependencies (React, react-router, etc.) during type-checking.
 *
 * Note: This file must remain a global script (no top-level import/export)
 * for the `declare module` to work as an ambient declaration rather than
 * a module augmentation.
 */
declare module "@client/entries/ssr" {
    import type { RenderApp } from "@shared/types/ssr";
    export const renderApp: RenderApp;
}
