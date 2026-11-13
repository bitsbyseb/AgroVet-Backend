import { z } from '@hono/zod-openapi';

export const auditLogQuerySchema = z.object({
    userId: z.string().optional().openapi({ example: 'uuid-user-123', description: 'Filtrar por ID de usuario' }),
    action: z.string().optional().openapi({ example: 'LOGIN', description: 'Acción realizada (LOGIN, CREATE, UPDATE, DELETE, ROLE_CHANGE, etc.)' }),
    resource: z.string().optional().openapi({ example: 'ANIMAL', description: 'Recurso afectado (ANIMAL, OWNER, AUTH, etc.)' }),
    from: z.string().optional().openapi({ example: '2026-11-01', description: 'Fecha inicial (ISO, inclusiva)' }),
    to: z.string().optional().openapi({ example: '2026-11-30', description: 'Fecha final (ISO, inclusiva)' }),
    status: z.string().optional().openapi({ example: 'SUCCESS', description: 'Estado del evento (SUCCESS, FAILURE)' }),
    limit: z.coerce.number().optional().openapi({ example: 50, description: 'Límite de registros' }),
    offset: z.coerce.number().optional().openapi({ example: 0, description: 'Desplazamiento para paginación' })
}).openapi('AuditLogQuery');

export const auditLogResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-log-123' }),
    userId: z.string().nullable().openapi({ example: 'uuid-user-123' }),
    userEmail: z.string().nullable().openapi({ example: 'vet@agrovet.com' }),
    userRole: z.string().nullable().openapi({ example: 'veterinarian' }),
    action: z.string().openapi({ example: 'CREATE' }),
    resource: z.string().openapi({ example: 'ANIMAL' }),
    resourceId: z.string().nullable().openapi({ example: 'uuid-animal-456' }),
    details: z.string().nullable().openapi({ example: '{"name":"Bessie"}' }),
    ipAddress: z.string().nullable().openapi({ example: '192.168.1.1' }),
    status: z.string().openapi({ example: 'SUCCESS' }),
    createdAt: z.string().openapi({ example: '2026-11-09T10:00:00.000Z' })
}).openapi('AuditLogResponse');

export const auditLogListResponseSchema = z.object({
    logs: z.array(auditLogResponseSchema),
    total: z.number().openapi({ example: 120 }),
    limit: z.number().openapi({ example: 50 }),
    offset: z.number().openapi({ example: 0 })
}).openapi('AuditLogListResponse');
