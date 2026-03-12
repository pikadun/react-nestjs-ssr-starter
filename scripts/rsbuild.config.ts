import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import { defineConfig, type EnvironmentConfig } from "@rsbuild/core";
import { pluginVue as PluginVue } from "@rsbuild/plugin-vue";
import PluginAutoImport from "unplugin-vue-components/rspack";

import pkg from "../package.json" with { type: "json" };
import {
    ASSET_PREFIX,
    AUTO_IMPORT_DTS_PATH,
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
    STATIC_NAME,
} from "./constant.ts";

const isDev = process.env.NODE_ENV === "production" ? false : true;

const serverConfig: EnvironmentConfig = {
    source: {
        entry: {
            [SERVER_ENTRY_NAME]: SERVER_ENTRY_PATH,
        },
        decorators: {
            version: "legacy",
        },
    },
    output: {
        target: "node",
        externals: [...Object.keys(pkg.dependencies), "tslib"].map(dep => new RegExp(`^${dep}($|/.*)`)),
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

const pluginVue = PluginVue();
const primeVueResolver = PrimeVueResolver();
const pluginAutoImport = PluginAutoImport({
    resolvers: [primeVueResolver],
    dts: AUTO_IMPORT_DTS_PATH,
});

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
            plugins: [pluginAutoImport],
        },
    },
    plugins: [pluginVue],
});
