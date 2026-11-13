import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { auditLogQuerySchema, auditLogListResponseSchema } from '../validators/AuditValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
export function createAuditRouter(auditController) {
    const router = new OpenAPIHono();
    // Autenticación JWT obligatoria
    router.use('*', authMiddleware);
    // Solo el rol administrator tiene acceso a la auditoría (HU19)
    router.use('*', rbacMiddleware('auditoria'));
    const listAuditLogsRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Consultar historial de actividades y auditoría',
        description: 'Permite al administrador consultar el registro de eventos y actividades con filtros por usuario, acción, recurso y rango de fechas.',
        security: [{ Bearer: [] }],
        request: {
            query: auditLogQuerySchema
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: auditLogListResponseSchema
                    }
                },
                description: 'Historial de actividades obtenido exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Parámetros de consulta inválidos'
            },
            401: { description: 'No autorizado - Token JWT ausente o inválido' },
            403: { description: 'Prohibido - Requiere rol administrator' },
            500: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Error interno del servidor'
            }
        },
        tags: ['Auditoría']
    });
    router.openapi(listAuditLogsRoute, (c) => auditController.list(c));
    return router;
}
