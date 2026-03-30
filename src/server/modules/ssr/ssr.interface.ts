import type { RenderApp } from "@shared/types/ssr";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface SsrServiceBase {
    init: () => Promise<void> | void;
    getTemplate: () => Promise<string> | string;
    getRender: () => Promise<RenderApp> | RenderApp;
    handleFallback: (req: FastifyRequest, res: FastifyReply) => Promise<void> | void;
}
