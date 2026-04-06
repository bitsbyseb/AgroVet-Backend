import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";

export const reproductionSchema = z.object({
    reproductiveStatus: z.nativeEnum(ReproductiveStatus),
    lastCalvingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").nullable().optional(),
    offspringCount: z.number().int().min(0).default(0),
    breedingType: z.enum(BreedingType).nullable().optional()
});

export const reproductionValidator = zValidator('json', reproductionSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
