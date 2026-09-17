import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { GrazingController } from '../controllers/grazingController.js';
import {
    grazingActivitySchema,
    grazingActivitySuccessResponseSchema
} from '../validators/grazingValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export function createGrazingRouter(grazingController: GrazingController) {
    const router = new OpenAPIHono();

    router.use('*', authMiddleware);

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

    // Control de acceso RBAC para roles autorizados (Zootechnician, Administrator)
    router.use('/', rbacMiddleware('pastoreo'));

    // Handlers
    router.openapi(registerGrazingActivityRoute, (c) => grazingController.register(c));

    return router;
}
