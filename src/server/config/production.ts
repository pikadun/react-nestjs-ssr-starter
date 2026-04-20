import type { Config } from "./schema";

export const production = (): Partial<Config> => ({
    isProd: true,
});
