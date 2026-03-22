import { IdParamsSchema } from "@shared/schemas/base.schema";
import { createZodDto } from "nestjs-zod";
import { type z } from "zod";

export class IdParamsDto extends createZodDto(IdParamsSchema) { }

export type IdParams = z.infer<typeof IdParamsSchema>;
