import path from "node:path";

export const STATIC_NAME = "static";
export const ROOT_DIR = path.resolve(import.meta.dirname, "..");
export const DIST_DIR = path.resolve(ROOT_DIR, "./lib");
export const SRC_DIR = path.resolve(ROOT_DIR, "./src");
export const SERVER_ENVIRONMENT_NAME = "server";
export const CLIENT_ENVIRONMENT_NAME = "client";
export const SERVER_ENTRY_NAME = "main";
export const CLIENT_ENTRY_NAME = "index";
export const CLIENT_SOURCE_DIR = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME);
export const SERVER_ENTRY_PATH = path.resolve(SRC_DIR, SERVER_ENVIRONMENT_NAME, `${SERVER_ENTRY_NAME}.ts`);
export const CLIENT_ENTRY_PATH = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME, `${CLIENT_ENTRY_NAME}.ts`);
export const HTML_TEMPLATE_PATH = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME, "index.html");
export const AUTO_IMPORT_DTS_PATH = path.resolve(SRC_DIR, CLIENT_ENVIRONMENT_NAME, "component.d.ts");
export const FAVICON_PATH = path.resolve(ROOT_DIR, "./public/favicon.svg");
export const ASSET_PREFIX = "./";
