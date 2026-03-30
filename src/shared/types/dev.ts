import type { RsbuildDevServer, Rspack } from "@rsbuild/core";
import type { Server } from "http";

import type { RenderApp } from "./ssr.ts";

export interface Application {
    bootstrap: () => Promise<Server>;
    stop: () => Promise<void>;
}

export interface SsrBundle {
    renderApp: RenderApp;
}

export interface CustomDevServer extends RsbuildDevServer {
    getServerAssetSource: (stats: Rspack.Stats[]) => string;
    loadServerBundle: () => Promise<Application>;
    loadSsrBundle: () => Promise<SsrBundle>;
    getTransformedHtml: () => Promise<string>;
}
