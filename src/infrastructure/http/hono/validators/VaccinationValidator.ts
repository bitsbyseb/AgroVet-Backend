import { z } from "@hono/zod-openapi";

export const vaccinationSchema = z.object({
    vaccineName: z.string().openapi({ example: 'Antiaftosa', description: 'Nombre de la vacuna' }),
    dose: z.string().openapi({ example: '5ml', description: 'Dosis aplicada' }),
    applicationDate: z.string().openapi({ example: '2023-10-05', description: 'Fecha de aplicación' })
}).openapi('VaccinationRequest');

export const vaccinationResponseSchema = vaccinationSchema.extend({
    id: z.string().openapi({ example: 'uuid-vac-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' })
}).openapi('VaccinationResponse');
