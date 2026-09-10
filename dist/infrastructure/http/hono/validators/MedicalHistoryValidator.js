import { z } from "@hono/zod-openapi";
export const medicalHistorySchema = z.object({
    date: z.string().openapi({ example: '2023-10-01T00:00:00Z', description: 'Fecha de la consulta (ISO 8601)' }),
    reason: z.string().openapi({ example: 'Control rutinario', description: 'Motivo de la atención' }),
    diagnosis: z.string().openapi({ example: 'Fiebre aftosa', description: 'Diagnóstico médico' }),
    treatment: z.string().openapi({ example: 'Antibióticos y reposo', description: 'Tratamiento recetado' }),
    observations: z.string().optional().openapi({ example: 'Observar evolución en 3 días', description: 'Notas adicionales' })
}).openapi('MedicalHistoryRequest');
export const medicalHistoryResponseSchema = medicalHistorySchema.extend({
    id: z.string().openapi({ example: 'uuid-hist-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' }),
    date: z.string().openapi({ example: '2023-10-01' })
}).openapi('MedicalHistoryResponse');
