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
export const CLIENT_SOURCE_DIR = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME);
export const SERVER_ENTRY_PATH = path.resolve(SRC_DIR, SERVER_ENVIRONMENT_NAME, `${SERVER_ENTRY_NAME}.ts`);
export const SSR_ENTRY_PATH = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME, "entries", `${SSR_ENTRY_NAME}.tsx`);
export const CLIENT_ENTRY_PATH = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME, "entries", `${CLIENT_ENTRY_NAME}.tsx`);
export const HTML_TEMPLATE_PATH = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME, "index.html");
export const FAVICON_PATH = path.resolve(ROOT_DIR, "./public/favicon.svg");
export const ASSET_PREFIX = "./";
