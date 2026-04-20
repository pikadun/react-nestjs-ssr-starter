import { z } from "zod";

const AppConfigSchema = z.object({
    basePath: z.string(),
    port: z.number(),
});

export const ConfigSchema = z.object({
    isDev: z.boolean().default(false),
    isStaging: z.boolean().default(false),
    isProd: z.boolean().default(false),

    app: AppConfigSchema,
});

export type Config = z.infer<typeof ConfigSchema>;
