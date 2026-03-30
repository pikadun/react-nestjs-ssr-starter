import type { RsbuildDevServer, Rspack } from "@rsbuild/core";

import type { Application, CustomDevServer, SsrBundle } from "../src/shared/types/dev.ts";
import {
    CLIENT_ENTRY_NAME,
    CLIENT_ENVIRONMENT_NAME,
    SERVER_ENTRY_NAME,
    SERVER_ENVIRONMENT_NAME,
    SSR_ENTRY_NAME,
} from "./constant.ts";

interface Asset {
    source: () => string | Buffer;
}

export const extendDevServer = (rsbuildDevServer: RsbuildDevServer) => {
    const devServer = rsbuildDevServer as CustomDevServer;

    devServer.getServerAssetSource = (stats: Rspack.Stats[]) => {
        const serverStats = stats.find(s => s.compilation.name === SERVER_ENVIRONMENT_NAME);
        const assets = serverStats?.compilation.assets[`${SERVER_ENTRY_NAME}.js`] as Asset | undefined;

        if (!assets) {
            throw new Error("Server assets not found");
        }

        return assets.source().toString();
    };

    devServer.loadServerBundle = async () => {
        const bundle = await devServer.environments[SERVER_ENVIRONMENT_NAME]
            ?.loadBundle<Application>(SERVER_ENTRY_NAME);

        if (!bundle) {
            throw new Error("Failed to load server bundle");
        }

        return bundle;
    };

    devServer.loadSsrBundle = async () => {
        const bundle = await devServer.environments[SERVER_ENVIRONMENT_NAME]
            ?.loadBundle<SsrBundle>(SSR_ENTRY_NAME);

        if (!bundle) {
            throw new Error("Failed to load SSR bundle");
        }

        return bundle;
    };

    devServer.getTransformedHtml = async () => {
        const htmlAsset = await devServer.environments[CLIENT_ENVIRONMENT_NAME]
            ?.getTransformedHtml(CLIENT_ENTRY_NAME);

        if (!htmlAsset) {
            throw new Error("Failed to load transformed HTML");
        }

        return htmlAsset;
    };

    return devServer;
};
