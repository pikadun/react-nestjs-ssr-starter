import { ReflectMetadataProvider } from "@mikro-orm/decorators/legacy";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Logger } from "@nestjs/common";

import type { Config } from "../../config/schema";
import { ConfigToken } from "../config/config.module";

export const DatabaseModule = MikroOrmModule.forRootAsync({
    driver: SqliteDriver,
    inject: [ConfigToken],
    useFactory: (config: Config) => {
        return {
            autoLoadEntities: true,
            dbName: ":memory:",
            debug: config.isDev,
            driver: SqliteDriver,
            logger: (message) => {
                Logger.log(message, MikroOrmModule.name);
            },
            metadataProvider: ReflectMetadataProvider,
            schemaGenerator: {
                createForeignKeyConstraints: false,
                disableForeignKeys: true,
            },
        };
    },
});
