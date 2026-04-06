import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const foodSchema = z.object({
    name: z.string().min(2),
    type: z.string().min(2),
    description: z.string().min(5)
});

export const foodValidator = zValidator('json', foodSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
