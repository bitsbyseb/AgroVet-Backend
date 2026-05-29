import { ProductionPurpose } from "@domain/entities/ProductionData.js";
import { z } from "@hono/zod-openapi";

export const productionSchema = z.object({
    type: z.string().openapi({ example: 'Leche', description: 'Tipo de producto (Leche, Carne, etc)' }),
    quantity: z.number().openapi({ example: 15.5, description: 'Cantidad producida' }),
    unit: z.string().openapi({ example: 'Litros', description: 'Unidad de medida' }),
    date: z.string().openapi({ example: '2023-10-12', description: 'Fecha de registro' }),
    purpose: z.enum(ProductionPurpose).openapi({example:"milk", description:"el proposito de la produccion o el producto"})
}).openapi('ProductionRequest');

export const productionResponseSchema = productionSchema.extend({
    id: z.string().openapi({ example: 'uuid-prod-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' })
}).openapi('ProductionResponse');
