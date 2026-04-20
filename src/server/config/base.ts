import type { Config } from "./schema";

export const base = (): Config => ({
    isDev: true,
    isStaging: false,
    isProd: false,
    app: {
        port: 8888,
        basePath: "/development",
    },
});
