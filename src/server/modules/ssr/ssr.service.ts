import fs from "node:fs/promises";
import path from "node:path";

import { renderApp } from "@client/ssr";
import { Injectable, NotFoundException } from "@nestjs/common";

import type { SsrServiceBase } from "./ssr.interface";

@Injectable()
export class SsrService implements SsrServiceBase {
    #template!: string;

    async init() {
        const templatePath = path.join(import.meta.dirname, "index.html");
        this.#template = await fs.readFile(templatePath, "utf-8");
    }

    getTemplate() {
        return this.#template;
    }

    getRender() {
        return renderApp;
    }

    handleFallback() {
        throw new NotFoundException();
    }
}
