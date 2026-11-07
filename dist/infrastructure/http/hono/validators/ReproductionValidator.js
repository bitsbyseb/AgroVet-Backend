import { BreedingType, ReproductiveStatus } from "../../../../domain/entities/Reproduction.js";
import { z } from "@hono/zod-openapi";
/**
 * Expresión regular para validar formato de fecha YYYY-MM-DD o ISO-8601 completa
 */
const dateOrIsoRegex = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
/**
 * Esquema de validación para registro o actualización de eventos reproductivos
 */
export const reproductionSchema = z.object({
    reproductiveStatus: z.enum(ReproductiveStatus).openapi({
        example: "pregnant",
        description: "Estado reproductivo del animal (empty, pregnant, lactating, anestrus, open, dry)"
    }),
    lastCalvingDate: z.string().regex(dateOrIsoRegex, "Formato de fecha inválido para lastCalvingDate (debe ser YYYY-MM-DD o ISO)").optional().openapi({
        example: "2026-05-24",
        description: "Fecha del último parto del animal"
    }),
    offspringCount: z.number().int({ message: "El conteo de crías debe ser un número entero" }).min(0, "El conteo de crías no puede ser negativo").default(0).openapi({
        example: 2,
        description: "Conteo histórico o actual de crías del animal"
    }),
    breedingType: z.enum(BreedingType).optional().openapi({
        example: "insemination",
        description: "Tipo de monta o técnica reproductiva (natural, insemination, artificial, embryo_transfer)"
    }),
    heatDate: z.string().regex(dateOrIsoRegex, "Formato de fecha inválido para heatDate (debe ser YYYY-MM-DD o ISO)").optional().openapi({
        example: "2026-05-10T08:00:00Z",
        description: "Fecha y hora del celo observado"
    }),
    expectedCalvingDate: z.string().regex(dateOrIsoRegex, "Formato de fecha inválido para expectedCalvingDate (debe ser YYYY-MM-DD o ISO)").optional().openapi({
        example: "2027-02-17",
        description: "Fecha estimada o calculada de parto"
    }),
    bullId: z.string().trim().max(100, "El ID del toro no puede superar 100 caracteres").optional().openapi({
        example: "TORO-098",
        description: "Identificador o código del toro/reproductor utilizado"
    }),
    semenBatch: z.string().trim().max(100, "El lote de semen no puede superar 100 caracteres").optional().openapi({
        example: "LOTE-SEMEN-2026-A",
        description: "Código o lote de la pajilla de semen"
    }),
    inseminationDetails: z.string().trim().max(1000, "Los detalles de inseminación no pueden superar 1000 caracteres").optional().openapi({
        example: "Inseminación artificial con pajilla descongelada a 37°C por técnico certificado",
        description: "Detalles adicionales técnicos o clínicos del evento de monta o inseminación"
    }),
    gestationDays: z.number().int().min(1).max(500).optional().openapi({
        example: 283,
        description: "Días de gestación para el cálculo automático de parto (por defecto: 283 para bovinos)"
    })
}).openapi('ReproductionRequest');
/**
 * Esquema de respuesta para un evento reproductivo individual
 */
export const reproductionResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-repro-123', description: 'ID del evento reproductivo' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456', description: 'ID del animal asociado' }),
    reproductiveStatus: z.enum(ReproductiveStatus).openapi({ example: 'pregnant' }),
    lastCalvingDate: z.string().nullable().optional().openapi({ example: '2026-05-24' }),
    offspringCount: z.number().openapi({ example: 2 }),
    breedingType: z.enum(BreedingType).nullable().optional().openapi({ example: 'insemination' }),
    heatDate: z.string().nullable().optional().openapi({ example: '2026-05-10T08:00:00.000Z' }),
    expectedCalvingDate: z.string().nullable().optional().openapi({ example: '2027-02-17T08:00:00.000Z' }),
    bullId: z.string().nullable().optional().openapi({ example: 'TORO-098' }),
    semenBatch: z.string().nullable().optional().openapi({ example: 'LOTE-SEMEN-2026-A' }),
    inseminationDetails: z.string().nullable().optional().openapi({ example: 'Inseminación artificial exitosa' }),
    createdAt: z.string().optional().openapi({ example: '2026-05-10T09:00:00.000Z' }),
    updatedAt: z.string().optional().openapi({ example: '2026-05-10T09:00:00.000Z' })
}).openapi('ReproductionResponse');
/**
 * Esquema de respuesta para el historial de eventos reproductivos
 */
export const reproductionListResponseSchema = z.array(reproductionResponseSchema).openapi('ReproductionListResponse');
/**
 * Esquema de parámetros para rutas de reproducción por ID de animal
 */
export const reproductionParamSchema = z.object({
    id: z.string().min(1, "El ID del animal es requerido").openapi({
        example: 'd9b2b2b1-6b8d-4f1e-9a2d-1c3e5f7a9b0c',
        description: 'Identificador único del animal'
    })
}).openapi('ReproductionParams');
