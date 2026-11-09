import { ProductionPurpose } from "@domain/entities/ProductionData.js";
import { z } from "@hono/zod-openapi";

export const productionSchema = z.object({
    type: z.string().openapi({ example: 'Leche', description: 'Tipo de producto (Leche, Carne, etc)' }),
    quantity: z.number().openapi({ example: 15.5, description: 'Cantidad producida' }),
    unit: z.string().openapi({ example: 'Litros', description: 'Unidad de medida' }),
    date: z.string().openapi({ example: '2023-10-12', description: 'Fecha de registro' }),
    purpose: z.enum(ProductionPurpose).openapi({ example: "milk", description: "el proposito de la produccion o el producto" }),
    productionDate: z.string().nullable().optional().openapi({ example: '2026-11-09', description: 'Fecha específica de producción (ISO)' }),
    weightGain: z.number().nullable().optional().openapi({ example: 1.5, description: 'Ganancia de peso en kg' }),
    productQuality: z.string().nullable().optional().openapi({ example: 'Alta', description: 'Calidad del producto (leche, carne, etc.)' })
}).openapi('ProductionRequest');

export const productionResponseSchema = productionSchema.extend({
    id: z.string().openapi({ example: 'uuid-prod-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' }),
    recordDate: z.string().optional().openapi({ example: '2026-11-09T00:00:00.000Z' }),
    productionDate: z.string().nullable().optional().openapi({ example: '2026-11-09' }),
    weightGain: z.number().nullable().optional().openapi({ example: 1.5 }),
    productQuality: z.string().nullable().optional().openapi({ example: 'Alta' })
}).openapi('ProductionResponse');

// ─── HU17: Production Indicators ─────────────────────────────────────────────

export const productionParamSchema = z.object({
    id: z.string().openapi({ example: 'uuid-animal-456', description: 'ID del animal' })
});

/** Query params for the indicators endpoint */
export const productionIndicatorsQuerySchema = z.object({
    from: z.string().optional().openapi({ example: '2026-10-01', description: 'Inicio del período (ISO, inclusivo). Por defecto: 30 días atrás.' }),
    to:   z.string().optional().openapi({ example: '2026-11-09', description: 'Fin del período (ISO, inclusivo). Por defecto: hoy.' })
});

const weightGainEvolutionSchema = z.object({
    date:                 z.string().openapi({ example: '2026-11-01T00:00:00.000Z' }),
    weight:               z.number().nullable().openapi({ example: 480.5 }),
    weightGain:           z.number().nullable().openapi({ example: 2.5 }),
    cumulativeWeightGain: z.number().openapi({ example: 12.0, description: 'Ganancia de peso acumulada en kg' })
}).openapi('WeightGainEvolution');

const periodSummarySchema = z.object({
    from:                 z.string().openapi({ example: '2026-10-01T00:00:00.000Z' }),
    to:                   z.string().openapi({ example: '2026-11-09T23:59:59.999Z' }),
    totalRecords:         z.number().int().openapi({ example: 15 }),
    totalWeight:          z.number().nullable().openapi({ example: 7200.0 }),
    avgWeight:            z.number().nullable().openapi({ example: 480.0 }),
    totalMilkProduction:  z.number().nullable().openapi({ example: 225.0 }),
    avgMilkProduction:    z.number().nullable().openapi({ example: 15.0 }),
    totalWeightGain:      z.number().nullable().openapi({ example: 37.5 }),
    qualityDistribution:  z.record(z.string(), z.number()).openapi({ example: { Alta: 8, Media: 7 } }),
    purposeDistribution:  z.record(z.string(), z.number()).openapi({ example: { milk: 10, meat: 5 } })
}).openapi('PeriodSummary');

export const productionIndicatorsResponseSchema = z.object({
    animalId:            z.string().openapi({ example: 'uuid-animal-456' }),
    period:              periodSummarySchema,
    weightGainEvolution: z.array(weightGainEvolutionSchema)
}).openapi('ProductionIndicators');
