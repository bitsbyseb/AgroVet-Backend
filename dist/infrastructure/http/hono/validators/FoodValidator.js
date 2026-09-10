import { z } from "@hono/zod-openapi";
export const foodSchema = z.object({
    name: z.string().openapi({ example: 'Concentrado Lechero 16%', description: 'Nombre del alimento' }),
    type: z.string().openapi({ example: 'Concentrado', description: 'Tipo de alimento (Forraje, Concentrado, Suplemento)' }),
    description: z.string().openapi({ example: "delicioso concentrado con contenido nutritivo", description: "descripcion del alimento a registrar" })
}).openapi('FoodRequest');
export const foodResponseSchema = foodSchema.extend({
    id: z.string().openapi({ example: 'uuid-food-123' })
}).openapi('FoodResponse');
export const foodListResponseSchema = z.array(foodResponseSchema).openapi('FoodListResponse');
