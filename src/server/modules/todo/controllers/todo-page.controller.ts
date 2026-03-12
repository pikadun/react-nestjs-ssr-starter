import { Controller } from "@nestjs/common";

import { Page } from "../../../common/decorators/page.decorator";
import { TodoService } from "../todo.service";

@Controller()
export class TodoPageController {
    constructor(private readonly service: TodoService) {}

    @Page("todo")
    async todo() {
        return this.service.findAll();
    }
}
