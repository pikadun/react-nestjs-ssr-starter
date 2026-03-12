import fs from "node:fs/promises";
import path from "node:path";

import { createApp } from "@client/ssr";
import {
    type CallHandler,
    type ExecutionContext,
    Injectable,
    type NestInterceptor,
    NotFoundException,
    type OnModuleInit,
} from "@nestjs/common";
import { AppRouteName } from "@shared/routes";
import { SSR_WINDOW_KEY } from "@shared/ssr-data";
import type { FastifyReply, FastifyRequest } from "fastify";
import { switchMap } from "rxjs";
import { renderToString } from "vue/server-renderer";

import { config } from "../../config";
import {
    CLIENT_ENTRY_NAME,
    CLIENT_ENVIRONMENT_NAME,
    HTML_PLACEHOLDER_BASE,
    HTML_PLACEHOLDER_CONTENT,
} from "../../constant";
import { stripBasePath } from "../../utils/url";

@Injectable()
export class SsrInterceptor implements NestInterceptor, OnModuleInit {
    #template!: string;

    async onModuleInit() {
        if (!global.devServer) {
            const templatePath = path.join(import.meta.dirname, "index.html");
            this.#template = await fs.readFile(templatePath, "utf-8");
        }
    }

    private async getTemplate(): Promise<string> {
        if (global.devServer) {
            return global.devServer.environments[CLIENT_ENVIRONMENT_NAME]?.getTransformedHtml(CLIENT_ENTRY_NAME) ?? "";
        }
        return this.#template;
    }

    private async render(url: string, data?: unknown) {
        const template = await this.getTemplate();
        const { app, router } = createApp({ basePath: config.basePath, ssrData: data });
        const location = router.resolve(url);

        if (location.name === AppRouteName.CatchAll) {
            return null;
        }

        await router.push(url);
        await router.isReady();

        const content = await renderToString(app);

        const serialized = data !== undefined
            ? `<script>window.${SSR_WINDOW_KEY}=${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
            : "";

        const renderData: Record<string, string> = {
            [HTML_PLACEHOLDER_BASE]: `<base href="${path.join(config.basePath, "/")}">`,
            [HTML_PLACEHOLDER_CONTENT]: content + serialized,
        };
        return template.replace(/<!--(\w+)-->/g, (_, key: string) => renderData[key] ?? "");
    }

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            switchMap(async (data?: unknown) => {
                const req = context.switchToHttp().getRequest<FastifyRequest>();
                const res = context.switchToHttp().getResponse<FastifyReply>();
                const url = stripBasePath(req.url);
                const html = await this.render(url, data);

                if (html) {
                    res.type("text/html").send(html);
                }
                else if (global.devServer) {
                    Object.assign(req.raw, { body: req.body, url });

                    await new Promise<void>((_resolve, reject) => {
                        global.devServer?.middlewares(req.raw, res.raw, () => {
                            reject(new NotFoundException());
                        });
                    });
                }
                else {
                    throw new NotFoundException();
                }
            }),
        );
    }
}
