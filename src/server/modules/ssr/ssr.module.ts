import { Global, Module } from "@nestjs/common";

import { SSR_SERVICE } from "./ssr.constant";
import { SsrService } from "./ssr.service";
import { SsrDevService } from "./ssr-dev.service";

@Global()
@Module({
    providers: [
        SsrService,
        SsrDevService,
        {
            provide: SSR_SERVICE,
            useFactory: (dev: SsrDevService, prod: SsrService) => {
                return global.__DEV_SERVER__ ? dev : prod;
            },
            inject: [SsrDevService, SsrService],
        },
    ],
    exports: [SSR_SERVICE],
})
export class SsrModule { }
