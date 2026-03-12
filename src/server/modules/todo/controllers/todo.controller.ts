import { Body, Delete, Get, Param, Post } from "@nestjs/common";

import { ApiController } from "../../../common/decorators/api-controller.decorator";
import { TodoCreateDto, TodoIdParamDto } from "../todo.dto";
import { TodoService } from "../todo.service";

@ApiController("todo")
export class TodoController {
    constructor(private readonly service: TodoService) { }

    @Get("/")
    async findAll() {
        return this.service.findAll();
    }

    @Delete("/:id")
    async delete(@Param() { id }: TodoIdParamDto) {
        return this.service.delete(id);
    }

    @Post("/")
    async create(@Body() { title }: TodoCreateDto) {
        return this.service.create(title);
    }
}
