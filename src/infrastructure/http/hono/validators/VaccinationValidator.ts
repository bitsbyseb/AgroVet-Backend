import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const vaccinationSchema = z.object({
    animalId: z.uuid(),
    vaccineName: z.string().min(2, "Vaccine name is required"),
    applicationDate: z.iso.datetime().transform((str) => new Date(str)),
    nextDoseDate: z.iso.datetime().transform((str) => new Date(str)).nullable().optional(),
    batchNumber: z.string().nullable().optional(),
    administeredBy: z.uuid()
});

export const updateVaccinationSchema = vaccinationSchema.partial();

export const vaccinationValidator = zValidator('json', vaccinationSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

export const updateVaccinationValidator = zValidator('json', updateVaccinationSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
