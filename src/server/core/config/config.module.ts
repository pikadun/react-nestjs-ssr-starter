import { Global, Module } from "@nestjs/common";

import { loadConfig } from "../../config/loader";

export const ConfigToken = Symbol("config");

@Global()
@Module({
    providers: [
        {
            provide: ConfigToken,
            useFactory: () => loadConfig(),
        },
    ],
    exports: [ConfigToken],
})
export class ConfigModule { }
