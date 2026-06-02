import deepmerge from "deepmerge";
import type { PartialDeep } from "type-fest";

import { getAppEnv } from "../utils/env";
import { base } from "./base";
import { loadEnvVarsConfig } from "./env";
import { production } from "./production";
import { loadRemoteConfig } from "./remote";
import { type Config, ConfigSchema } from "./schema";

const envConfigMap: Record<string, () => PartialDeep<Config>> = {
    production,
};

const getEnvConfig = (): PartialDeep<Config> => {
    const env = getAppEnv();
    return envConfigMap[env]?.() ?? {};
};

export const loadConfig = async () => {
    const remoteConfig = await loadRemoteConfig();
    const rawConfig = deepmerge.all<PartialDeep<Config>>([
        base(),
        getEnvConfig(),
        remoteConfig,
        loadEnvVarsConfig(),
    ]);

    return ConfigSchema.parse(rawConfig);
};
