import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { AppController } from "./app.controller";
import { DatabaseModule } from "./core/database/database.module";
import { SsrModule } from "./modules/ssr/ssr.module";
import { TodoModule } from "./modules/todo/todo.module";

@Module({
    imports: [
        DatabaseModule.forRoot(),

        SsrModule,
        TodoModule,
    ],
    // AppController has a wildcard route, so it must be registered last
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ZodSerializerInterceptor,
        },
    ],
})
export class AppModule { }
