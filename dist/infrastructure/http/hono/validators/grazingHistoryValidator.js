import { z } from "@hono/zod-openapi";
export const grazingHistoryQuerySchema = z.object({
    animalId: z.string().uuid({ message: 'animalId debe ser un UUID válido' }).optional().openapi({
        param: {
            name: 'animalId',
            in: 'query',
            required: false
        },
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Identificador único del animal para filtrar el historial (UUID)'
    }),
    paddockId: z.string().uuid({ message: 'paddockId debe ser un UUID válido' }).optional().openapi({
        param: {
            name: 'paddockId',
            in: 'query',
            required: false
        },
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Identificador único del potrero para filtrar el historial (UUID)'
    }),
    startDate: z.string().openapi({
        param: {
            name: 'startDate',
            in: 'query',
            required: false
        },
        example: '2026-03-01T00:00:00.000Z',
        description: 'Fecha inicial para filtrar actividades de pastoreo (formato ISO 8601)'
    }).refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'startDate debe ser una fecha válida en formato ISO'
    }).optional(),
    endDate: z.string().openapi({
        param: {
            name: 'endDate',
            in: 'query',
            required: false
        },
        example: '2026-03-31T23:59:59.000Z',
        description: 'Fecha final para filtrar actividades de pastoreo (formato ISO 8601)'
    }).refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'endDate debe ser una fecha válida en formato ISO'
    }).optional()
}).openapi('GrazingHistoryQueryParams');
export const permanenceTimeResponseSchema = z.object({
    days: z.number().int().openapi({ example: 3, description: 'Días completos de permanencia' }),
    hours: z.number().int().openapi({ example: 6, description: 'Horas residuales de permanencia' }),
    totalHours: z.number().int().openapi({ example: 78, description: 'Total de horas acumuladas de permanencia' }),
    inProgress: z.boolean().openapi({ example: false, description: 'Indica si la rotación de pastoreo sigue en curso' }),
    formatted: z.string().openapi({ example: '3 días, 6 horas', description: 'Texto formateado del tiempo de permanencia' })
}).openapi('PermanenceTimeResponse');
export const grazingHistoryItemResponseSchema = z.object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174099' }),
    paddockId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    animalIds: z.array(z.string().uuid()).openapi({ example: ['123e4567-e89b-12d3-a456-426614174001'] }),
    entryDate: z.string().openapi({ example: '2026-03-01T08:00:00.000Z' }),
    exitDate: z.string().nullable().openapi({ example: '2026-03-04T14:00:00.000Z' }),
    rotationNumber: z.number().int().openapi({ example: 1 }),
    observations: z.string().nullable().openapi({ example: 'Rotación regular con buen forraje' }),
    createdAt: z.string().optional().openapi({ example: '2026-03-01T08:00:00.000Z' }),
    updatedAt: z.string().optional().openapi({ example: '2026-03-04T14:00:00.000Z' }),
    permanenceTime: permanenceTimeResponseSchema
}).openapi('GrazingHistoryItemResponse');
export const grazingHistoryListResponseSchema = z.array(grazingHistoryItemResponseSchema).openapi('GrazingHistoryListResponse');
