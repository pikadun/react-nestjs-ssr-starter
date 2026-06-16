import type { RsbuildDevServer, Rspack } from "@rsbuild/core";
import type { Server } from "http";

import type { RenderApp } from "../shared/types/ssr.type.ts";

declare global {
    interface Application {
        bootstrap: () => Promise<Server>;
        stop: () => Promise<void>;
    }

    interface SsrBundle {
        renderApp: RenderApp;
    }

    interface CustomDevServer extends RsbuildDevServer {
        getServerAssetSource: (stats: Rspack.Stats[]) => string;
        loadServerBundle: () => Promise<Application>;
        loadSsrBundle: () => Promise<SsrBundle>;
        getTransformedHtml: () => Promise<string>;
    }

    var __DEV_SERVER__: CustomDevServer | undefined;
}

export { };
