import type { CustomDevServer } from "@shared/types/dev";

declare global {
    var __DEV_SERVER__: CustomDevServer | undefined;
}

export { };
