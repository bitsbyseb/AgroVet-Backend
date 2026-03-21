import { z } from "zod";
const envVars = z.object({
    DATABASE_PASSWORD: z.string({ error: "password is required on .env file" }),
    DATABASE_USERNAME: z.string({ error: "username is required on .env file" }),
    DATABASE_NAME: z.string({ error: "no database name found" }),
    PORT: z.string({
        error: "no port number found"
    }).min(1).max(4),
    JWT_SECRET: z.string({ error: "no jwt defined" })
});
envVars.parse(process.env);
