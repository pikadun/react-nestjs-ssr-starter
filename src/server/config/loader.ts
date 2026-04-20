import deepmerge from "deepmerge";

import { base } from "./base";
import { loadEnvVarsConfig } from "./env";
import { production } from "./production";
import { loadRemoteConfig } from "./remote";
import { type Config, ConfigSchema } from "./schema";

const envConfigMap: Record<string, () => object> = {
    production,
};

const getEnvConfig = (): Partial<Config> => {
    const env = process.env.APP_ENV ?? "development";
    return envConfigMap[env]?.() ?? {};
};

export const loadConfig = async () => {
    const remoteConfig = await loadRemoteConfig();
    const rawConfig = deepmerge.all<Config>([
        base(),
        getEnvConfig(),
        remoteConfig,
        loadEnvVarsConfig(),
    ]);

    return ConfigSchema.parse(rawConfig);
};
