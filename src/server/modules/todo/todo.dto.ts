import { idParamSchema } from "@shared/schemas/base.schema";
import { createTodoSchema } from "@shared/schemas/todo.schema";
import { createZodDto } from "nestjs-zod";

export class TodoIdParamDto extends createZodDto(idParamSchema) { }

export class TodoCreateDto extends createZodDto(createTodoSchema) { }
