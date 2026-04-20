import { All, Controller, Get, Inject, Req, Res } from "@nestjs/common";
import { type FastifyReply, type FastifyRequest } from "fastify";

import { Page } from "./common/decorators/page.decorator";
import type { Config } from "./config/schema";
import { ConfigToken } from "./core/config/config.module";
import { ensureBasePath } from "./utils/url";

@Controller()
export class AppController {
    constructor(
        @Inject(ConfigToken) private readonly config: Config,
    ) { }

    @Page("*", global.__DEV_SERVER__ ? All : Get)
    serve(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        const url = ensureBasePath(req.url, this.config.app.basePath);

        // SsrInterceptor handles rendering and dev-server fallback.
        return req.url !== url ? res.redirect(url, 307) : null;
    }
}
