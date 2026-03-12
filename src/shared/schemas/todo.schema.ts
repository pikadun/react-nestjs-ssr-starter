import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().trim().min(1).max(120),
});

export type CreateTodoType = z.infer<typeof createTodoSchema>;
