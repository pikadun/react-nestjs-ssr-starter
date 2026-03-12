import { All, Controller, Get } from "@nestjs/common";

import { Page } from "./common/decorators/page.decorator";

@Controller()
export class AppController {
    @Page("*", global.devServer ? All : Get)
    serve() {
        // SsrInterceptor handles rendering and dev-server fallback.
    }
}
