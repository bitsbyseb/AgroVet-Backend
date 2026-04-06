import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export enum AllowedUserRole {
    VETERINARIAN = 'veterinarian',
    ZOOTECHNICIAN = "zootechnician"
}

export const signupSchema = z.object({
    username:z.string()
    .min(10,{error:"username must be at least 10 characters long"})
    .max(20,{
        error:"username cannot be larger than 20 characters"
    }),
    role:z.enum(AllowedUserRole),
    email:z.email(),
    password:z.string().min(10,{error:"password must be at least 10 characters long"})
});

export const signupValidator = zValidator('json',signupSchema,(result, c) => {
    if (!result.success) {
        return c.json({
            errors:result.error.issues.map(iss => iss.message)
        },
    400);
    }
});