import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ProductionPurpose } from "@domain/entities/ProductionData.js";

export const productionSchema = z.object({
    weight: z.number().nullable().optional(),
    milkProduction: z.number().nullable().optional(),
    purpose: z.enum(ProductionPurpose),
    recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional()
});

export const productionValidator = zValidator('json', productionSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
