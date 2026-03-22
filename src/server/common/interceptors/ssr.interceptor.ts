import fs from "node:fs/promises";
import path from "node:path";

import { renderApp } from "@client/ssr";
import {
    type CallHandler,
    type ExecutionContext,
    Injectable,
    type NestInterceptor,
    NotFoundException,
    type OnModuleInit,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { switchMap } from "rxjs";

import { config } from "../../config";
import {
    CLIENT_ENTRY_NAME,
    CLIENT_ENVIRONMENT_NAME,
    HTML_PLACEHOLDER_BASE,
    HTML_PLACEHOLDER_CONTENT,
} from "../../constant";
import { ensureBasePath, stripBasePath } from "../../utils/url";

@Injectable()
export class SsrInterceptor implements NestInterceptor, OnModuleInit {
    #template!: string;

    async onModuleInit() {
        if (!global.devServer) {
            const templatePath = path.join(import.meta.dirname, "index.html");
            this.#template = await fs.readFile(templatePath, "utf-8");
        }
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
                else if (global.devServer) {
                    await new Promise<void>((_resolve, reject) => {
                        Object.assign(req.raw, { body: req.body, url: stripBasePath(req.url) });
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

    private async render(url: string, loaderData: unknown) {
        const template = await this.getTemplate();
        const request = new Request(`http://localhost${ensureBasePath(url)}`);
        const content = await renderApp({ basename: config.basePath, request, loaderData });

        if (!content) {
            return null;
        }

        const renderData: Record<string, string> = {
            [HTML_PLACEHOLDER_BASE]: `<base href="${path.join(config.basePath, "/")}">`,
            [HTML_PLACEHOLDER_CONTENT]: content,
        };

        return template.replace(/<!--(\w+)-->/g, (_, key: string) => renderData[key] ?? "");
    }

    private async getTemplate(): Promise<string> {
        if (global.devServer) {
            return global.devServer.environments[CLIENT_ENVIRONMENT_NAME]?.getTransformedHtml(CLIENT_ENTRY_NAME) ?? "";
        }
        return this.#template;
    }
}
