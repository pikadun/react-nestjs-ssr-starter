import fs from "node:fs/promises";
import { IncomingMessage } from "node:http";
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

    private async render(incoming: IncomingMessage) {
        const template = await this.getTemplate();
        const request = new Request(`http://localhost${incoming.url}`);

        const content = await renderApp({ request });

        if (!content) {
            return null;
        }

        const renderData: Record<string, string> = {
            [HTML_PLACEHOLDER_BASE]: `<base href="${path.join(config.basePath, "/")}">`,
            [HTML_PLACEHOLDER_CONTENT]: content,
        };

        return template.replace(/<!--(\w+)-->/g, (_, key: string) => renderData[key] ?? "");
    }

    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            switchMap(async () => {
                const req = context.switchToHttp().getRequest<FastifyRequest>();
                const res = context.switchToHttp().getResponse<FastifyReply>();
                Object.assign(req.raw, { body: req.body, url: stripBasePath(req.url) });

                const html = await this.render(req.raw);

                if (html) {
                    res.type("text/html").send(html);
                }
                else if (global.devServer) {
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
