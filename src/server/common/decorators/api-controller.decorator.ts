import path from "node:path";

import { Controller } from "@nestjs/common";

export const ApiController = (prefix: string) => {
    return Controller(path.join("/api", prefix));
};
