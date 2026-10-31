import { z } from "@hono/zod-openapi";

export const physiologicalConstantsSchema = z.object({
    heartRate: z.number()
        .positive('La frecuencia cardíaca debe ser un número positivo')
        .max(500, 'Frecuencia cardíaca fuera de rango biológico')
        .nullable()
        .optional()
        .openapi({ example: 80, description: 'Frecuencia cardíaca en latidos por minuto (lpm / bpm)' }),
    respiratoryRate: z.number()
        .positive('La frecuencia respiratoria debe ser un número positivo')
        .max(200, 'Frecuencia respiratoria fuera de rango biológico')
        .nullable()
        .optional()
        .openapi({ example: 24, description: 'Frecuencia respiratoria en respiraciones por minuto (rpm)' }),
    temperature: z.number()
        .min(25, 'Temperatura por debajo de rango biológico admisible')
        .max(45, 'Temperatura por encima de rango biológico admisible')
        .nullable()
        .optional()
        .openapi({ example: 38.5, description: 'Temperatura corporal (°C)' }),
    capillaryRefillTime: z.number()
        .min(0, 'Tiempo de llenado capilar debe ser positivo')
        .max(20, 'Tiempo de llenado capilar fuera de rango')
        .nullable()
        .optional()
        .openapi({ example: 1.5, description: 'Tiempo de llenado capilar en segundos (TRC)' }),
    mucosalState: z.string()
        .max(100, 'Descripción de mucosas demasiado extensa')
        .nullable()
        .optional()
        .openapi({ example: 'rosadas', description: 'Estado de las mucosas (rosadas, pálidas, cianóticas, ictéricas)' })
}).passthrough().openapi('PhysiologicalConstants');

export const medicalHistorySchema = z.object({
    animalId: z.string().uuid().optional().openapi({ example: 'uuid-animal-123', description: 'ID del animal (opcional si se envía en la URL)' }),
    date: z.string().min(1, 'La fecha es obligatoria').openapi({ example: '2026-10-20T10:00:00Z', description: 'Fecha de la consulta (ISO 8601)' }),
    reason: z.string().min(1, 'El motivo de consulta es obligatorio').openapi({ example: 'Control rutinario', description: 'Motivo de la atención' }),
    diagnosis: z.string().min(1, 'El diagnóstico es obligatorio').openapi({ example: 'Evolución favorable', description: 'Diagnóstico médico' }),
    treatment: z.string().min(1, 'El tratamiento es obligatorio').openapi({ example: 'Antibióticos y reposo', description: 'Tratamiento recetado' }),
    observations: z.string().nullable().optional().openapi({ example: 'Observar evolución en 3 días', description: 'Notas adicionales' }),
    evolution: z.string().nullable().optional().openapi({ example: 'Paciente muestra mejoría clínica notable', description: 'Notas de evolución clínica (HU8)' }),
    physiologicalConstants: physiologicalConstantsSchema.nullable().optional(),
    weight: z.number().positive('El peso debe ser mayor a 0').nullable().optional().openapi({ example: 25.5, description: 'Peso corporal en kilogramos (kg)' }),
    bodyConditionScore: z.number().positive('La condición corporal debe ser mayor a 0').max(9, 'La escala máxima es 9').nullable().optional().openapi({ example: 3.5, description: 'Condición corporal (escala 1-5 o 1-9)' }),
    // Campos atómicos de conveniencia
    heartRate: z.number().positive().nullable().optional().openapi({ example: 80 }),
    respiratoryRate: z.number().positive().nullable().optional().openapi({ example: 24 }),
    temperature: z.number().min(25).max(45).nullable().optional().openapi({ example: 38.5 }),
    capillaryRefillTime: z.number().min(0).nullable().optional().openapi({ example: 1.5 }),
    mucosalState: z.string().nullable().optional().openapi({ example: 'rosadas' })
}).openapi('MedicalHistoryRequest');

export const updateMedicalHistorySchema = z.object({
    reason: z.string().min(1).optional().openapi({ example: 'Control actualizado' }),
    diagnosis: z.string().min(1).optional().openapi({ example: 'Diagnóstico actualizado' }),
    treatment: z.string().min(1).optional().openapi({ example: 'Nuevo plan terapéutico' }),
    observations: z.string().nullable().optional().openapi({ example: 'Nuevas observaciones' }),
    evolution: z.string().nullable().optional().openapi({ example: 'Evolución favorable en 48 horas' }),
    physiologicalConstants: physiologicalConstantsSchema.nullable().optional(),
    weight: z.number().positive('El peso debe ser mayor a 0').nullable().optional().openapi({ example: 26.0 }),
    bodyConditionScore: z.number().positive().max(9).nullable().optional().openapi({ example: 4.0 }),
    heartRate: z.number().positive().nullable().optional().openapi({ example: 85 }),
    respiratoryRate: z.number().positive().nullable().optional().openapi({ example: 22 }),
    temperature: z.number().min(25).max(45).nullable().optional().openapi({ example: 38.6 }),
    capillaryRefillTime: z.number().min(0).nullable().optional().openapi({ example: 1.5 }),
    mucosalState: z.string().nullable().optional().openapi({ example: 'rosadas' })
}).openapi('UpdateMedicalHistoryRequest');

export const medicalHistoryResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-hist-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' }),
    date: z.union([z.string(), z.date()]).openapi({ example: '2026-10-20T10:00:00.000Z' }),
    reason: z.string().openapi({ example: 'Control rutinario' }),
    diagnosis: z.string().openapi({ example: 'Evolución favorable' }),
    treatment: z.string().openapi({ example: 'Antibióticos y reposo' }),
    observations: z.string().nullable().optional().openapi({ example: 'Notas adicionales' }),
    evolution: z.string().nullable().optional().openapi({ example: 'Paciente muestra mejoría clínica notable' }),
    physiologicalConstants: physiologicalConstantsSchema.nullable().optional(),
    weight: z.number().nullable().optional().openapi({ example: 25.5 }),
    bodyConditionScore: z.number().nullable().optional().openapi({ example: 3.5 }),
    createdBy: z.string().optional().openapi({ example: 'uuid-user-789' }),
    createdAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional()
}).openapi('MedicalHistoryResponse');

export const medicalHistoryListResponseSchema = z.array(medicalHistoryResponseSchema).openapi('MedicalHistoryListResponse');
