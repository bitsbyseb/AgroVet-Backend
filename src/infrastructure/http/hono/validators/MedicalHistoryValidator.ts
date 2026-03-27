import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const medicalHistorySchema = z.object({
    animalId: z.uuid(),
    date: z.iso.datetime().default(new Date().toISOString()),
    reason: z.string().min(5, "Reason is too short"),
    diagnosis: z.string().min(5, "Diagnosis is required"),
    treatment: z.string().min(5, "Treatment is required"),
    observations: z.string().optional().default(""),
    createdBy: z.uuid()
});

export const updateMedicalHistorySchema = medicalHistorySchema.partial();

export const medicalHistoryValidator = zValidator('json', medicalHistorySchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

export const updateMedicalHistoryValidator = zValidator('json', updateMedicalHistorySchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
