import { z } from "@hono/zod-openapi";

export const vaccinationSchema = z.object({
    vaccineName: z.string().openapi({ example: 'Antiaftosa', description: 'Nombre de la vacuna' }),
    applicationDate: z.string().openapi({ example: '2023-10-05', description: 'Fecha de aplicación (ISO 8601)' }),
    nextDoseDate: z.string().optional().nullable().openapi({ example: '2024-10-05', description: 'Fecha de la próxima dosis' }),
    batchNumber: z.string().optional().nullable().openapi({ example: 'LOTE123', description: 'Número de lote' })
}).openapi('VaccinationRequest');

export const vaccinationResponseSchema = vaccinationSchema.extend({
    id: z.string().openapi({ example: 'uuid-vac-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' })
}).openapi('VaccinationResponse');
