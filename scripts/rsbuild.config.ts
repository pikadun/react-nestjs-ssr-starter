import { defineConfig, type EnvironmentConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

import pkg from "../package.json" with { type: "json" };
import {
    ASSET_PREFIX,
    CLIENT_ENTRY_NAME,
    CLIENT_ENTRY_PATH,
    CLIENT_ENVIRONMENT_NAME,
    DIST_DIR,
    FAVICON_PATH,
    HTML_TEMPLATE_PATH,
    ROOT_DIR,
    SERVER_ENTRY_NAME,
    SERVER_ENTRY_PATH,
    SERVER_ENVIRONMENT_NAME,
    SSR_ENTRY_NAME,
    SSR_ENTRY_PATH,
    STATIC_NAME,
} from "./constant.ts";

const isDev = process.env.NODE_ENV === "production" ? false : true;

const serverConfig: EnvironmentConfig = {
    source: {
        entry: {
            [SERVER_ENTRY_NAME]: SERVER_ENTRY_PATH,
            [SSR_ENTRY_NAME]: {
                import: SSR_ENTRY_PATH,
                asyncChunks: false,
            },
        },
        decorators: {
            version: "legacy",
        },
    },
    output: {
        target: "node",
        externals: [
            ...Object.keys(pkg.dependencies).concat("tslib").map(dep => new RegExp(`^${dep}($|/.*)`)),
            {
                "@client/entries/ssr": "module ./ssr.js",
            },
        ],
        sourceMap: {
            js: isDev ? "inline-cheap-module-source-map" : "nosources-source-map",
        },
    },
};

const clientConfig: EnvironmentConfig = {
    source: {
        entry: {
            [CLIENT_ENTRY_NAME]: CLIENT_ENTRY_PATH,
        },
    },
    output: {
        target: "web",
        sourceMap: {
            js: isDev ? "inline-cheap-module-source-map" : false,
        },
    },
};

const reactPlugin = pluginReact();

export default defineConfig({
    root: ROOT_DIR,
    mode: isDev ? "development" : "production",
    dev: {
        assetPrefix: ASSET_PREFIX,
    },
    server: {
        middlewareMode: true,
        printUrls: false,
        publicDir: false,
        htmlFallback: false,
    },
    html: {
        template: HTML_TEMPLATE_PATH,
        favicon: FAVICON_PATH,
    },
    output: {
        distPath: {
            root: DIST_DIR,
            favicon: STATIC_NAME,
        },
        legalComments: "none",
        assetPrefix: ASSET_PREFIX,
    },
    environments: {
        [SERVER_ENVIRONMENT_NAME]: serverConfig,
        [CLIENT_ENVIRONMENT_NAME]: clientConfig,
    },
    tools: {
        rspack: {
            experiments: {
                nativeWatcher: true,
            },
            watchOptions: {
                aggregateTimeout: 50,
            },
            plugins: [],
            output: {
                devtoolModuleFilenameTemplate: isDev ? "[absolute-resource-path]" : undefined,
            },
        },
    },
    plugins: [reactPlugin],
});
