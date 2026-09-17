import { z } from "@hono/zod-openapi";
export const grazingActivitySchema = z.object({
    paddockId: z.string().uuid().openapi({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Identificador único del potrero (UUID)'
    }),
    animalIds: z.array(z.string().uuid()).min(1).openapi({
        example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
        description: 'Array de identificadores únicos de los animales (UUIDs)'
    }),
    entryDate: z.string().openapi({
        example: '2026-03-01T08:00:00.000Z',
        description: 'Fecha y hora de entrada de los animales al potrero (formato ISO 8601)'
    }),
    exitDate: z.string().nullable().optional().openapi({
        example: '2026-03-05T17:00:00.000Z',
        description: 'Fecha y hora de salida de los animales del potrero (opcional)'
    }),
    rotationNumber: z.number().int().min(1).openapi({
        example: 1,
        description: 'Número de rotación de pastoreo (entero mayor o igual a 1)'
    }),
    observations: z.string().nullable().optional().openapi({
        example: 'Lote de novillos en pastoreo intensivo rotacional',
        description: 'Observaciones o notas adicionales del pastoreo'
    })
}).openapi('CreateGrazingActivityRequest');
export const grazingActivityResponseSchema = z.object({
    id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174099' }),
    paddockId: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    animalIds: z.array(z.string()).openapi({ example: ['123e4567-e89b-12d3-a456-426614174001'] }),
    entryDate: z.string().openapi({ example: '2026-03-01T08:00:00.000Z' }),
    exitDate: z.string().nullable().openapi({ example: '2026-03-05T17:00:00.000Z' }),
    rotationNumber: z.number().openapi({ example: 1 }),
    observations: z.string().nullable().openapi({ example: 'Lote en pastoreo intensivo' }),
    createdAt: z.string().optional().openapi({ example: '2026-03-01T08:00:00.000Z' }),
    updatedAt: z.string().optional().openapi({ example: '2026-03-01T08:00:00.000Z' })
}).openapi('GrazingActivityResponse');
export const grazingActivitySuccessResponseSchema = z.object({
    message: z.string().openapi({ example: 'Actividad de pastoreo registrada exitosamente' }),
    id: z.string().openapi({ example: '123e4567-e89b-12d3-a456-426614174099' })
}).openapi('GrazingActivitySuccessResponse');
export const grazingActivityListResponseSchema = z.array(grazingActivityResponseSchema).openapi('GrazingActivityListResponse');
