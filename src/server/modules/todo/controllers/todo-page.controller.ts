import { Controller } from "@nestjs/common";
import { PageRoute } from "@shared/routes";
import { ZodSerializerDto } from "nestjs-zod";

import { Page } from "../../../common/decorators/page.decorator";
import { ListTodosResponseDto } from "../todo.dto";
import { TodoService } from "../todo.service";

@Controller()
export class TodoPageController {
    constructor(private readonly service: TodoService) {}

    @ZodSerializerDto(ListTodosResponseDto)
    @Page(PageRoute.TodoList)
    async todo() {
        return this.service.findAll();
    }
}
