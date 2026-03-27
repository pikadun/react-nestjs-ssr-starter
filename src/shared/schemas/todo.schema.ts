import { z } from "zod";

import { CreatedAtSchema, IdSchema, UpdatedAtSchema } from "./base.schema";

const TodoSchema = z.object({
    id: IdSchema,
    title: z.string().trim().min(1).max(120),
    createdAt: CreatedAtSchema,
    updatedAt: UpdatedAtSchema,
});

export const CreateTodoBodySchema = TodoSchema.pick({
    title: true,
});
export type CreateTodo = z.infer<typeof CreateTodoBodySchema>;

export const ListTodosResponseSchema = z.array(TodoSchema);

export type ListTodosResponse = z.infer<typeof ListTodosResponseSchema>;
