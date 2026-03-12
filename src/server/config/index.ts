import deepmerge from "deepmerge";

import { AppEnv } from "../utils/env";
import { DevelopmentConfig } from "./development.config";
import { type Config, ProductionConfig } from "./production.config";

let config = ProductionConfig;

if (config.appEnv === AppEnv.Development) {
    config = deepmerge(config, DevelopmentConfig) as Config;
}

export { config };
