import { config } from "../config";

export function stripBasePath(url: string): string {
    if (config.basePath === "/") {
        return url;
    }

    const base = config.basePath;

    if (url === base) {
        return "/";
    }

    if (url.startsWith(base + "/") || url.startsWith(base + "?") || url.startsWith(base + "#")) {
        return url.slice(base.length);
    }

    return url;
}
