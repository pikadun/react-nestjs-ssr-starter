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
import { HTML_PLACEHOLDER_BASE, HTML_PLACEHOLDER_CONTENT } from "../../constant";
import { SSR_SERVICE } from "../../modules/ssr/ssr.constant";
import type { SsrServiceBase } from "../../modules/ssr/ssr.interface";
import { ensureBasePath } from "../../utils/url";

@Injectable()
export class SsrInterceptor implements NestInterceptor, OnModuleInit {
    constructor(@Inject(SSR_SERVICE) private readonly strategy: SsrServiceBase) {}

    async onModuleInit() {
        await this.strategy.init();
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
                    await this.strategy.handleFallback(req, res);
                }
            }),
        );
    }

    private async render(url: string, loaderData: unknown) {
        const template = await this.strategy.getTemplate();
        const request = new Request(`http://localhost${ensureBasePath(url)}`);
        const render = await this.strategy.getRender();
        const content = await render({ basename: config.basePath, request, loaderData });

        if (!content) {
            return null;
        }

        const renderData: Record<string, string> = {
            [HTML_PLACEHOLDER_BASE]: `<base href="${path.join(config.basePath, "/")}">`,
            [HTML_PLACEHOLDER_CONTENT]: content,
        };

        return template.replace(/<!--(\w+)-->/g, (_, key: string) => renderData[key] ?? "");
    }
}
