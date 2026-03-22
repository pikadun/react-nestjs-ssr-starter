import { CreateTodoBodySchema, ListTodosResponseSchema } from "@shared/schemas/todo.schema";
import { createZodDto } from "nestjs-zod";

export class CreateTodoBodyDto extends createZodDto(CreateTodoBodySchema) { }

export class ListTodosResponseDto extends createZodDto(ListTodosResponseSchema) { }
