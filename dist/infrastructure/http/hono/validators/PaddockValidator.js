import { z } from "@hono/zod-openapi";
import { PaddockStatus } from "../../../../domain/entities/Paddock.js";
export const paddockSchema = z.object({
    name: z.string().min(1).openapi({ example: 'Potrero La Esperanza', description: 'Nombre único del potrero' }),
    capacity: z.number().int().min(0).openapi({ example: 25, description: 'Capacidad máxima de animales' }),
    area: z.number().positive().nullable().optional().openapi({ example: 10.5, description: 'Área en hectáreas del potrero (opcional)' }),
    status: z.nativeEnum(PaddockStatus).optional().openapi({ example: PaddockStatus.ACTIVE, description: 'Estado del potrero (ACTIVE, RESTING, MAINTENANCE)' }),
    description: z.string().nullable().optional().openapi({ example: 'Potrero con pasto Brachiaria', description: 'Descripción u observaciones' })
}).openapi('PaddockRequest');
export const updatePaddockSchema = z.object({
    name: z.string().min(1).optional().openapi({ example: 'Potrero La Esperanza Norte' }),
    capacity: z.number().int().min(0).optional().openapi({ example: 30 }),
    area: z.number().positive().nullable().optional().openapi({ example: 12.0 }),
    status: z.nativeEnum(PaddockStatus).optional().openapi({ example: PaddockStatus.RESTING }),
    description: z.string().nullable().optional().openapi({ example: 'En descanso de pastoreo' })
}).openapi('UpdatePaddockRequest');
export const paddockResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-paddock-123' }),
    name: z.string().openapi({ example: 'Potrero La Esperanza' }),
    capacity: z.number().openapi({ example: 25 }),
    area: z.number().nullable().openapi({ example: 10.5 }),
    status: z.nativeEnum(PaddockStatus).openapi({ example: PaddockStatus.ACTIVE }),
    description: z.string().nullable().openapi({ example: 'Potrero con pasto Brachiaria' }),
    createdAt: z.string().optional().openapi({ example: '2026-09-09T20:00:00.000Z' }),
    updatedAt: z.string().optional().openapi({ example: '2026-09-09T20:00:00.000Z' })
}).openapi('PaddockResponse');
export const paddockListResponseSchema = z.array(paddockResponseSchema).openapi('PaddockListResponse');
