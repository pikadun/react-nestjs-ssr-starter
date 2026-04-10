import path from "node:path";

import {
    type CallHandler,
    type ExecutionContext,
    Inject,
    Injectable,
    type NestInterceptor,
    type OnModuleInit,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { switchMap } from "rxjs";

import { config } from "../../config";
import { HTML_PLACEHOLDER_BASE, HTML_PLACEHOLDER_CONTENT, HTML_PLACEHOLDER_SSR_STATE } from "../../constant";
import { ensureBasePath } from "../../utils/url";
import { SSR_SERVICE } from "./ssr.constant";
import type { SsrServiceBase } from "./ssr.interface";

@Injectable()
export class SsrInterceptor implements NestInterceptor, OnModuleInit {
    constructor(@Inject(SSR_SERVICE) private readonly service: SsrServiceBase) {}

    async onModuleInit() {
        await this.service.init();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            switchMap(async (data: unknown) => {
                const req = context.switchToHttp().getRequest<FastifyRequest>();
                const res = context.switchToHttp().getResponse<FastifyReply>();
                const html = await this.render(req.url, data);

                if (html) {
                    res.type("text/html").send(html);
                }
                else {
                    await this.service.handleFallback(req, res);
                }
            }),
        );
    }

    private async render(url: string, prefetchedData: unknown) {
        const template = await this.service.getTemplate();
        const request = new Request(`http://localhost${ensureBasePath(url)}`);
        const render = await this.service.getRender();
        const result = await render({ basename: config.basePath, request, prefetchedData });

        if (!result) {
            return null;
        }

        const renderData: Record<string, string> = {
            [HTML_PLACEHOLDER_BASE]: `<base href="${path.join(config.basePath, "/")}">`,
            [HTML_PLACEHOLDER_CONTENT]: result.html,
            [HTML_PLACEHOLDER_SSR_STATE]:
                `<script>window.__SSR_STATE__ = ${JSON.stringify(result.dehydratedState)}</script>`,
        };

        return template.replace(/<!--([\w-]+)-->/g, (_, key: string) => renderData[key] ?? "");
    }
}
