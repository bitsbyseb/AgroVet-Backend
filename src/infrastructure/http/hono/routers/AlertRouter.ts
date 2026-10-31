import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AlertController } from '../controllers/AlertController.js';
import {
    generateAlertsSchema,
    generateAlertsResponseSchema,
    alertIdParamSchema,
    getAlertsQuerySchema,
    alertListResponseSchema,
    markAsReadResponseSchema,
    markAllAsReadResponseSchema
} from '../validators/AlertValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export function createAlertRouter(alertController: AlertController) {
    const router = new OpenAPIHono();

    // Autenticación y RBAC global para este router ('alertas')
    // Full Access: veterinarian, zootechnician, administrator
    router.use('*', authMiddleware);
    router.use('*', rbacMiddleware('alertas'));

    // ── POST /generate — Generar alertas automáticas para un animal ───────────
    const generateRoute = createRoute({
        method: 'post',
        path: '/generate',
        summary: 'Generar alertas automáticas',
        description: 'Evalúa condiciones de disparo en vacunas, tratamientos y controles del animal y genera alertas. Las alertas de prioridad "high" envían correo electrónico.',
        security: [{ Bearer: [] }],
        request: {
            body: {
                content: { 'application/json': { schema: generateAlertsSchema } }
            }
        },
        responses: {
            201: {
                content: { 'application/json': { schema: generateAlertsResponseSchema } },
                description: 'Alertas generadas exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Datos inválidos'
            },
            401: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'No autenticado'
            },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Alertas']
    });

    // ── GET / — Listar alertas con filtros ────────────────────────────────────
    const listRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar alertas del sistema',
        description: 'Retorna alertas filtradas por usuario, animal, estado, prioridad o módulo. Los veterinarios solo ven sus propias alertas si no especifican userId.',
        security: [{ Bearer: [] }],
        request: {
            query: getAlertsQuerySchema
        },
        responses: {
            200: {
                content: { 'application/json': { schema: alertListResponseSchema } },
                description: 'Lista de alertas'
            },
            500: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Error interno del servidor'
            }
        },
        tags: ['Alertas']
    });

    // ── GET /pending — Alertas pendientes del usuario autenticado ─────────────
    const listPendingRoute = createRoute({
        method: 'get',
        path: '/pending',
        summary: 'Alertas pendientes del usuario autenticado',
        description: 'Retorna únicamente las alertas con estado "pending" del usuario que realiza la solicitud.',
        security: [{ Bearer: [] }],
        responses: {
            200: {
                content: { 'application/json': { schema: alertListResponseSchema } },
                description: 'Alertas pendientes'
            },
            401: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'No autenticado'
            }
        },
        tags: ['Alertas']
    });

    // ── PATCH /read-all — Marcar todas como leídas ───────────────────────────
    const markAllAsReadRoute = createRoute({
        method: 'patch',
        path: '/read-all',
        summary: 'Marcar todas las alertas como leídas',
        description: 'Marca en lote todas las alertas pendientes del usuario autenticado como leídas.',
        security: [{ Bearer: [] }],
        responses: {
            200: {
                content: { 'application/json': { schema: markAllAsReadResponseSchema } },
                description: 'Alertas marcadas como leídas'
            },
            401: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'No autenticado'
            }
        },
        tags: ['Alertas']
    });

    // ── PATCH /:id/read — Marcar una alerta como leída ───────────────────────
    const markAsReadRoute = createRoute({
        method: 'patch',
        path: '/{id}/read',
        summary: 'Marcar alerta como leída',
        description: 'Cambia el estado de una alerta específica de "pending" a "read".',
        security: [{ Bearer: [] }],
        request: {
            params: alertIdParamSchema
        },
        responses: {
            200: {
                content: { 'application/json': { schema: markAsReadResponseSchema } },
                description: 'Alerta marcada como leída'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Alerta ya leída o datos inválidos'
            },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Alerta no encontrada'
            }
        },
        tags: ['Alertas']
    });

    // Vinculación de rutas con el controlador
    router.openapi(generateRoute,      (c) => alertController.generate(c));
    router.openapi(listRoute,          (c) => alertController.list(c));
    router.openapi(listPendingRoute,   (c) => alertController.listPending(c));
    router.openapi(markAllAsReadRoute, (c) => alertController.markAllAsRead(c));
    router.openapi(markAsReadRoute,    (c) => alertController.markAsRead(c));

    return router;
}
