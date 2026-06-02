import { unflatten } from "flat";
import type { PartialDeep } from "type-fest";

import type { Config } from "./schema";

const ENV_KEY_PREFIX = "cherry__";

export const loadEnvVarsConfig = (): PartialDeep<Config> => {
    const flatConfig: Record<string, string> = {};

    for (const [rawKey, rawValue] of Object.entries(process.env)) {
        if (!rawKey.startsWith(ENV_KEY_PREFIX) || !rawValue) {
            continue;
        }

        const configKey = rawKey.slice(ENV_KEY_PREFIX.length);
        if (!configKey) {
            continue;
        }

        flatConfig[configKey] = rawValue;
    }

    return unflatten(flatConfig, { delimiter: "__" });
};
