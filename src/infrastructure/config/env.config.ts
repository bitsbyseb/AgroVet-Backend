import { z } from "zod";

const envVars = z.object({
    DATABASE_PASSWORD: z.string({error:"password is required on .env file"}),
    DATABASE_USERNAME: z.string({error:"username is required on .env file"}),
    DATABASE_NAME: z.string({error:"no database name found"}),
    PORT:z.string({
        error:"no port number found"
    }).min(1).max(4),
    JWT_SECRET:z.string({error:"no jwt defined"}),
    DATABASE_HOST:z.string({ error:"no host found" }).min(2).max(20).default("localhost"),
    DATABASE_PORT:z.string({error:"no database port found"}).min(4).default("3306"),
    RESEND_API_KEY:z.string({error:"no resend api key found"}).min(20)
});

envVars.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv  extends z.infer<typeof envVars> {}
    }
}
