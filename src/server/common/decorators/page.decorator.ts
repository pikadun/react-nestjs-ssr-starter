import { applyDecorators, Get, UseInterceptors } from "@nestjs/common";

import { SsrInterceptor } from "../../modules/ssr/ssr.interceptor";

export const Page = (path: string, method: typeof Get = Get) => {
    return applyDecorators(
        method(path),
        UseInterceptors(SsrInterceptor),
    );
};
