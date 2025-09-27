import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.union([z.undefined(), z.enum(["test", "development", "production"])]),
    POSTGRES_HOST: z.union([z.undefined(), z.string()]),
    POSTGRES_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    GOOGLE_API_KEYFILE: z.string(),
    WB_API_KEY: z.string(),
    WORKER_QUERY_INTERVAL: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    FORMAT_EXPORT: z
        .enum(["true", "false"])
        .transform((value) => value == "true"),
    APP_PORT: z.union([
        z.undefined(),
        z
            .string()
            .regex(/^[0-9]+$/)
            .transform((value) => parseInt(value)),
    ]),
});

const env = envSchema.parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    GOOGLE_API_KEYFILE: process.env.GOOGLE_API_KEYFILE,
    WB_API_KEY: process.env.WB_API_KEY,
    WORKER_QUERY_INTERVAL: process.env.WORKER_QUERY_INTERVAL ?? 3600000, // 1 hour
    FORMAT_EXPORT: process.env.FORMAT_EXPORT ?? true,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT ?? 5000,
});

export default env;
