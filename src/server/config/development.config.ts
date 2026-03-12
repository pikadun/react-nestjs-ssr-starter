import type { PartialDeep } from "type-fest";

import { type Config } from "./production.config";

export const DevelopmentConfig: PartialDeep<Config> = {
    basePath: "/development",
};
