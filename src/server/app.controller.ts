import { All, Controller, Get, Req, Res } from "@nestjs/common";
import { type FastifyReply, type FastifyRequest } from "fastify";

import { Page } from "./common/decorators/page.decorator";
import { ensureBasePath } from "./utils/url";

@Controller()
export class AppController {
    @Page("*", global.devServer ? All : Get)
    serve(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        const url = ensureBasePath(req.url);

        // SsrInterceptor handles rendering and dev-server fallback.
        return req.url !== url ? res.redirect(url, 307) : null;
    }
}
