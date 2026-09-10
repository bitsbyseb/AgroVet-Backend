import { BreedingType, ReproductiveStatus } from "../../../../domain/entities/Reproduction.js";
import { z } from "@hono/zod-openapi";
export const reproductionSchema = z.object({
    reproductiveStatus: z.enum(ReproductiveStatus).openapi({
        example: "pregnant",
        description: "el estado actual del animal con respecto a su actividad sexual y estado de gestacion"
    }),
    lastCalvingDate: z.string().optional().openapi({ example: "2026-05-24", description: "fecha del ultimo parto" }),
    offspringCount: z.number().openapi({ example: 10, description: "conteo de crias del animal" }),
    breedingType: z.enum(BreedingType).optional().openapi({ example: "natural", description: "describe si el acto reproductivo fue por medio de intervencion humana o natural" })
}).openapi('ReproductionRequest');
export const reproductionResponseSchema = reproductionSchema.extend({
    id: z.string().openapi({ example: 'uuid-repro-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' })
}).openapi('ReproductionResponse');
