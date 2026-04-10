import path from "node:path";

export const STATIC_NAME = "static";
export const ROOT_DIR = path.resolve(import.meta.dirname, "..");
export const DIST_DIR = path.resolve(ROOT_DIR, "./lib");
export const SRC_DIR = path.resolve(ROOT_DIR, "./src");
export const SERVER_ENVIRONMENT_NAME = "server";
export const CLIENT_ENVIRONMENT_NAME = "client";
export const SERVER_ENTRY_NAME = "main";
export const SSR_ENTRY_NAME = "ssr";
export const CLIENT_ENTRY_NAME = "index";

export const SERVER_SOURCE_DIR = path.resolve(SRC_DIR, SERVER_ENVIRONMENT_NAME);
export const CLIENT_SOURCE_DIR = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME);
export const CLIENT_ENTRIES_DIR = path.resolve(CLIENT_SOURCE_DIR, "entries");

export const SERVER_ENTRY_PATH = path.resolve(SERVER_SOURCE_DIR, `${SERVER_ENTRY_NAME}.ts`);
export const SSR_ENTRY_PATH = path.resolve(CLIENT_ENTRIES_DIR, `${SSR_ENTRY_NAME}.tsx`);
export const CLIENT_ENTRY_PATH = path.resolve(CLIENT_ENTRIES_DIR, `${CLIENT_ENTRY_NAME}.tsx`);
export const HTML_TEMPLATE_PATH = path.resolve(CLIENT_SOURCE_DIR, "index.html");
export const FAVICON_PATH = path.resolve(ROOT_DIR, "./public/favicon.svg");
/** Rsbuild asset prefix. "./" means assets are resolved relative to the HTML file. */
export const ASSET_PREFIX = "./";
