import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { GrazingController } from '../controllers/grazingController.js';
import { GrazingHistoryController } from '../controllers/grazingHistoryController.js';
import {
    grazingActivitySchema,
    grazingActivitySuccessResponseSchema,
    grazingActivityListResponseSchema
} from '../validators/grazingValidator.js';
import {
    grazingHistoryQuerySchema,
    grazingHistoryListResponseSchema
} from '../validators/grazingHistoryValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export const getGrazingHistoryRoute = createRoute({
    method: 'get',
    path: '/history',
    summary: 'Consultar historial de pastoreo con tiempo de permanencia',
    description: 'Obtiene el historial detallado de rotaciones de pastoreo con cálculo dinámico del tiempo de permanencia (días y horas, estado en curso), con filtros opcionales por potrero, animal y rango de fechas',
    security: [{ Bearer: [] }],
    request: {
        query: grazingHistoryQuerySchema
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: grazingHistoryListResponseSchema
                }
            },
            description: 'Historial de actividades de pastoreo con tiempo de permanencia calculado'
        },
        400: {
            content: {
                'application/json': {
                    schema: errorResponseSchema
                }
            },
            description: 'Parámetros de consulta inválidos o rango de fechas incoherente'
        },
        401: {
            description: 'No autorizado: Token JWT faltante o inválido'
        },
        403: {
            description: 'Prohibido: Rol de usuario no autorizado para acceder a este recurso'
        }
    },
    tags: ['Pastoreo']
});

export function createGrazingRouter(
    grazingController: GrazingController,
    grazingHistoryController?: GrazingHistoryController
) {
    const router = new OpenAPIHono();

    router.use('*', authMiddleware);

    const listGrazingActivitiesRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar todas las actividades de pastoreo',
        description: 'Obtiene el historial de actividades de pastoreo, opcionalmente filtradas por potrero',
        security: [{ Bearer: [] }],
        request: {
            query: z.object({
                paddockId: z.string().uuid().optional().openapi({ description: 'Filtrar por ID de potrero' })
            })
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: grazingActivityListResponseSchema
                    }
                },
                description: 'Lista de actividades de pastoreo'
            }
        },
        tags: ['Pastoreo']
    });

    const registerGrazingActivityRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar una nueva actividad de pastoreo',
        description: 'Registra el ingreso y rotación de un lote de animales en un potrero específico',
        security: [{ Bearer: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: grazingActivitySchema
                    }
                }
            }
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: grazingActivitySuccessResponseSchema
                    }
                },
                description: 'Actividad de pastoreo registrada exitosamente'
            },
            400: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema
                    }
                },
                description: 'Datos inválidos o potrero en estado de mantenimiento'
            },
            404: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema
                    }
                },
                description: 'Potrero no encontrado'
            }
        },
        tags: ['Pastoreo']
    });

    // Control de acceso RBAC para roles autorizados (Zootechnician, Administrator, Veterinarian for read)
    router.use('/', rbacMiddleware('pastoreo'));
    router.use('/history', rbacMiddleware('pastoreo'));

    // Handlers
    router.openapi(listGrazingActivitiesRoute, (c) => grazingController.list(c));
    router.openapi(registerGrazingActivityRoute, (c) => grazingController.register(c));

    if (grazingHistoryController) {
        router.openapi(getGrazingHistoryRoute, (c) => grazingHistoryController.getHistory(c));
    }

    return router;
}
