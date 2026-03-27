import { Body, Delete, Get, Param, Post } from "@nestjs/common";
import { ZodSerializerDto } from "nestjs-zod";

import { ApiController } from "../../../common/decorators/api-controller.decorator";
import type { IdParamsDto } from "../../../common/dto/id-params.dto";
import { type CreateTodoBodyDto, ListTodosResponseDto } from "../todo.dto";
import { TodoService } from "../todo.service";

@ApiController("todo")
export class TodoController {
    constructor(private readonly service: TodoService) { }

    @Get("/")
    @ZodSerializerDto(ListTodosResponseDto)
    async findAll() {
        return this.service.findAll();
    }

    @Delete("/:id")
    async delete(@Param() { id }: IdParamsDto) {
        return this.service.delete(id);
    }

    @Post("/")
    async create(@Body() { title }: CreateTodoBodyDto) {
        return this.service.create(title);
    }
}
