import { ReflectMetadataProvider } from "@mikro-orm/decorators/legacy";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Logger } from "@nestjs/common";

import { config } from "../../config";
import { AppEnv } from "../../utils/env";

export const DatabaseModule = MikroOrmModule.forRoot({
    autoLoadEntities: true,
    dbName: ":memory:",
    debug: config.appEnv === AppEnv.Development,
    driver: SqliteDriver,
    logger: (message) => {
        Logger.log(message, MikroOrmModule.name);
    },
    metadataProvider: ReflectMetadataProvider,
    registerRequestContext: true,
    schemaGenerator: {
        createForeignKeyConstraints: false,
        disableForeignKeys: true,
    },
});
