import path from "node:path";

export function stripBasePath(url: string, basePath: string): string {
    if (basePath === "/") {
        return url;
    }

    if (url === basePath) {
        return "/";
    }

    if (url.startsWith(basePath + "/") || url.startsWith(basePath + "?") || url.startsWith(basePath + "#")) {
        return url.slice(basePath.length);
    }

    return url;
}

export function ensureBasePath(url: string, basePath: string): string {
    if (!url.startsWith(basePath)) {
        url = path.join(basePath, url);
    }

    return url;
}
