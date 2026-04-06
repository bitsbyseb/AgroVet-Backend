import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { weightUnits, frequency } from "@domain/entities/Alimentation.js";

export const alimentationSchema = z.object({
    foodId: z.uuid(),
    count: z.number().positive(),
    unit: z.enum(weightUnits),
    frequency: z.enum(frequency),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    observations: z.string().optional().default("")
});

export const alimentationValidator = zValidator('json', alimentationSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
