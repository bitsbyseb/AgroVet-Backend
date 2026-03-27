import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AppointmentStatus } from "@domain/entities/Appointment.js";

export const appointmentSchema = z.object({
    animalId: z.uuid(),
    date: z.iso.datetime().transform((str) => new Date(str)),
    reason: z.string().min(5, "Reason is too short"),
    status: z.enum(AppointmentStatus).optional().default(AppointmentStatus.SCHEDULED),
    createdBy: z.uuid()
});

export const updateAppointmentSchema = appointmentSchema.partial();

export const appointmentValidator = zValidator('json', appointmentSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});

export const updateAppointmentValidator = zValidator('json', updateAppointmentSchema, (result, c) => {
    if (!result.success) {
        return c.json({ errors: result.error.issues.map(iss => iss.message) }, 400);
    }
});
