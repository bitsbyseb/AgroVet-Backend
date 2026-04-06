import { z } from "@hono/zod-openapi";

export const appointmentSchema = z.object({
    date: z.string().openapi({ example: '2023-12-01T10:00:00Z', description: 'Fecha y hora de la consulta (ISO 8601)' }),
    reason: z.string().openapi({ example: 'Revisión general', description: 'Motivo de la consulta' }),
    animalId: z.string().openapi({ example: 'uuid-animal-123', description: 'ID del animal' }),
    status: z.string().optional().openapi({ example: 'Scheduled', description: 'Estado de la consulta (Scheduled, Completed, Cancelled)' })
}).openapi('AppointmentRequest');

export const updateAppointmentSchema = z.object({
    status: z.string().openapi({ example: 'Completed', description: 'Nuevo estado de la consulta' })
}).openapi('UpdateAppointmentRequest');

export const appointmentResponseSchema = appointmentSchema.extend({
    id: z.string().openapi({ example: 'uuid-appt-123' })
}).openapi('AppointmentResponse');

export const appointmentListResponseSchema = z.array(appointmentResponseSchema).openapi('AppointmentListResponse');
