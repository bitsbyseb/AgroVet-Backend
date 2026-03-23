import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(10,{error:"password must be at least 10 characters long"})
});

export const loginValidator = zValidator('json',loginSchema,(result, c) => {
    if (!result.success) {
        return c.json({
            errors:result.error.issues.map(iss => iss.message)
        },
    400);
    }
});