import { z } from "@hono/zod-openapi";
export const alimentationSchema = z.object({
    foodId: z.string().openapi({ example: 'uuid-food-123', description: 'ID del alimento' }),
    quantity: z.number().openapi({ example: 2.5, description: 'Cantidad en kg' }),
    frequency: z.string().openapi({ example: 'Diario', description: 'Frecuencia de alimentación' })
}).openapi('AlimentationRequest');
export const alimentationResponseSchema = alimentationSchema.extend({
    id: z.string().openapi({ example: 'uuid-diet-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' }),
    date: z.string().openapi({ example: '2023-10-10' })
}).openapi('AlimentationResponse');
