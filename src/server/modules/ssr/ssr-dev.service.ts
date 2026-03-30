import { Injectable, NotFoundException } from "@nestjs/common";
import type { CustomDevServer } from "@shared/types/dev";
import type { FastifyReply, FastifyRequest } from "fastify";

import { stripBasePath } from "../../utils/url";
import type { SsrServiceBase } from "./ssr.interface";

@Injectable()
export class SsrDevService implements SsrServiceBase {
    #devServer!: CustomDevServer;

    init() {
        if (!global.__DEV_SERVER__) {
            throw new Error("Dev server is not available");
        }

        this.#devServer = global.__DEV_SERVER__;
    }

    async getTemplate() {
        return this.#devServer.getTransformedHtml();
    }

    async getRender() {
        const ssrBundle = await this.#devServer.loadSsrBundle();
        return ssrBundle.renderApp;
    }

    async handleFallback(req: FastifyRequest, res: FastifyReply) {
        return new Promise<never>((_resolve, reject) => {
            Object.assign(req.raw, { body: req.body, url: stripBasePath(req.url) });
            this.#devServer.middlewares(req.raw, res.raw, () => {
                reject(new NotFoundException());
            });
        });
    }
}
