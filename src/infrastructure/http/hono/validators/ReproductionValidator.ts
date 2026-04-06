import { z } from "@hono/zod-openapi";

export const reproductionSchema = z.object({
    date: z.string().openapi({ example: '2023-11-01', description: 'Fecha del evento reproductivo' }),
    eventType: z.string().openapi({ example: 'Inseminación', description: 'Tipo de evento (Inseminación, Parto, etc)' }),
    notes: z.string().optional().openapi({ example: 'Exitoso', description: 'Notas adicionales' })
}).openapi('ReproductionRequest');

export const reproductionResponseSchema = reproductionSchema.extend({
    id: z.string().openapi({ example: 'uuid-repro-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' })
}).openapi('ReproductionResponse');
