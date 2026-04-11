import path from "node:path";

import { MikroORM } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Application } from "@shared/types/dev";

import { AppModule } from "./app.module";
import { config } from "./config";
import { STATIC_NAME } from "./constant";

const logger = new Logger("Main");
let app: NestFastifyApplication;

export const bootstrap: Application["bootstrap"] = async () => {
    app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
        routerOptions: {
            ignoreTrailingSlash: true,
        },
    }));

    // Set global prefix for all routes, exclude the ssr route
    app.setGlobalPrefix(config.basePath, { exclude: ["\\*"] });

    if (!global.__DEV_SERVER__) {
        const staticPath = path.join(import.meta.dirname, STATIC_NAME);
        const staticPrefix = path.join(config.basePath, STATIC_NAME);
        app.useStaticAssets({ root: staticPath, prefix: staticPrefix });
    }
    else {
        await app.get(MikroORM).schema.update();
    }

    const server = await app.listen(config.port);
    const appUrl = await app.getUrl();

    logger.log(`Application (${config.appEnv}) is running on: ${appUrl}`);

    return server;
};

export const stop: Application["stop"] = async () => {
    await app.close();
};

if (!global.__DEV_SERVER__) {
    await bootstrap();
}
