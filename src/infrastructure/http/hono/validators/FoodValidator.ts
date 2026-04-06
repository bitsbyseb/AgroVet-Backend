import { z } from "@hono/zod-openapi";

export const foodSchema = z.object({
    name: z.string().openapi({ example: 'Concentrado Lechero 16%', description: 'Nombre del alimento' }),
    type: z.string().openapi({ example: 'Concentrado', description: 'Tipo de alimento (Forraje, Concentrado, Suplemento)' }),
    brand: z.string().optional().openapi({ example: 'Purina', description: 'Marca comercial' }),
    nutritionalValue: z.string().openapi({ example: 'Proteína 16%, Energía 2.5 Mcal', description: 'Información nutricional' })
}).openapi('FoodRequest');

export const foodResponseSchema = foodSchema.extend({
    id: z.string().openapi({ example: 'uuid-food-123' })
}).openapi('FoodResponse');

export const foodListResponseSchema = z.array(foodResponseSchema).openapi('FoodListResponse');
