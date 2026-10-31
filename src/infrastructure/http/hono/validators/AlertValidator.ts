import { z } from '@hono/zod-openapi';

// ─── Enums compartidos ────────────────────────────────────────────────────────

export const alertModuleTypeSchema = z.enum([
    'vaccination',
    'treatment',
    'control',
    'feeding',
    'reproduction',
    'production',
    'grazing'
]).openapi({ example: 'vaccination', description: 'Módulo de origen de la alerta' });

export const alertStatusSchema = z.enum(['pending', 'read'])
    .openapi({ example: 'pending', description: 'Estado actual de la alerta' });

export const alertPrioritySchema = z.enum(['low', 'medium', 'high'])
    .openapi({ example: 'high', description: 'Nivel de prioridad de la alerta' });

// ─── Request: Generar alertas para un animal ──────────────────────────────────

export const generateAlertsSchema = z.object({
    animalId: z.string().uuid('El ID del animal debe ser un UUID válido')
        .openapi({ example: 'uuid-animal-123', description: 'ID del animal para el que se generarán las alertas' }),
    daysAhead: z.number()
        .int('El número de días debe ser un entero')
        .min(1, 'Debe ser al menos 1 día')
        .max(365, 'El máximo de anticipación es 365 días')
        .optional()
        .openapi({ example: 7, description: 'Días de anticipación para detectar eventos próximos (por defecto: 7)' })
}).openapi('GenerateAlertsRequest');

// ─── Request: Parámetros de ruta ──────────────────────────────────────────────

export const alertIdParamSchema = z.object({
    id: z.string().uuid('El ID de la alerta debe ser un UUID válido')
        .openapi({ example: 'uuid-alert-123', description: 'ID único de la alerta' })
});

// ─── Request: Query params para GET /alerts ───────────────────────────────────

export const getAlertsQuerySchema = z.object({
    userId: z.string().uuid().optional()
        .openapi({ example: 'uuid-user-123', description: 'Filtrar por ID de usuario' }),
    animalId: z.string().uuid().optional()
        .openapi({ example: 'uuid-animal-456', description: 'Filtrar por ID de animal' }),
    status: alertStatusSchema.optional(),
    priority: alertPrioritySchema.optional(),
    moduleType: alertModuleTypeSchema.optional(),
    onlyDue: z.enum(['true', 'false']).optional()
        .openapi({ example: 'true', description: 'Si es "true", retorna solo alertas vencidas/activas' })
}).openapi('GetAlertsQuery');

// ─── Response: Alerta individual ─────────────────────────────────────────────

export const alertResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-alert-123' }),
    animalId: z.string().openapi({ example: 'uuid-animal-456' }),
    userId: z.string().openapi({ example: 'uuid-user-789' }),
    moduleType: alertModuleTypeSchema,
    message: z.string().openapi({ example: '⚠️ La vacuna "Rabia" del animal "Max" está VENCIDA.' }),
    triggerDate: z.union([z.string(), z.date()])
        .openapi({ example: '2026-10-20T10:00:00.000Z', description: 'Fecha y hora de disparo de la alerta' }),
    status: alertStatusSchema,
    priority: alertPrioritySchema,
    emailSent: z.boolean().openapi({ example: false, description: 'Indica si se envió correo de notificación' }),
    createdAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional()
}).openapi('AlertResponse');

export const alertListResponseSchema = z.array(alertResponseSchema)
    .openapi('AlertListResponse');

// ─── Response: Generación de alertas ─────────────────────────────────────────

export const generateAlertsResponseSchema = z.object({
    message: z.string().openapi({ example: 'Alertas generadas correctamente' }),
    generated: z.number().openapi({ example: 3, description: 'Cantidad de alertas generadas' }),
    alerts: alertListResponseSchema
}).openapi('GenerateAlertsResponse');

// ─── Response: Marcar como leída ─────────────────────────────────────────────

export const markAsReadResponseSchema = z.object({
    message: z.string().openapi({ example: 'Alerta marcada como leída' }),
    data: alertResponseSchema.optional()
}).openapi('MarkAsReadResponse');

export const markAllAsReadResponseSchema = z.object({
    message: z.string().openapi({ example: 'Todas las alertas marcadas como leídas' }),
    marked: z.number().openapi({ example: 5, description: 'Cantidad de alertas marcadas' })
}).openapi('MarkAllAsReadResponse');
