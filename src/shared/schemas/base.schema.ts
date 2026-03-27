import z from "zod";

export const IdSchema = z.coerce.number().int().positive();
export type Id = z.infer<typeof IdSchema>;

export const CreatedAtSchema = z.coerce.date();
export type CreatedAt = z.infer<typeof CreatedAtSchema>;

export const UpdatedAtSchema = z.coerce.date();
export type UpdatedAt = z.infer<typeof UpdatedAtSchema>;

export const IdParamsSchema = z.object({
    id: IdSchema,
});
export type IdParams = z.infer<typeof IdParamsSchema>;
