import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { PaddockController } from '../controllers/PaddockController.js';
import { paddockSchema, updatePaddockSchema, paddockResponseSchema, paddockListResponseSchema } from '../validators/PaddockValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
export function createPaddockRouter(paddockController) {
    const router = new OpenAPIHono();
    router.use('*', authMiddleware);
    const listPaddocksRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar todos los potreros',
        security: [{ Bearer: [] }],
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: paddockListResponseSchema
                    }
                },
                description: 'Lista de potreros registrados'
            }
        },
        tags: ['Potreros']
    });
    const getPaddockByIdRoute = createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Obtener potrero por ID',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({
                id: z.string().openapi({ example: 'uuid-paddock-123', description: 'ID del potrero' })
            })
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: paddockResponseSchema
                    }
                },
                description: 'Detalle del potrero'
            },
            404: {
                description: 'Potrero no encontrado'
            }
        },
        tags: ['Potreros']
    });
    const registerPaddockRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar un nuevo potrero',
        security: [{ Bearer: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: paddockSchema
                    }
                }
            }
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            id: z.string()
                        })
                    }
                },
                description: 'Potrero registrado exitosamente'
            },
            400: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema
                    }
                },
                description: 'Datos inválidos o nombre de potrero duplicado'
            }
        },
        tags: ['Potreros']
    });
    const updatePaddockRoute = createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Actualizar información de un potrero',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({
                id: z.string().openapi({ example: 'uuid-paddock-123', description: 'ID del potrero' })
            }),
            body: {
                content: {
                    'application/json': {
                        schema: updatePaddockSchema
                    }
                }
            }
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                },
                description: 'Potrero actualizado exitosamente'
            },
            400: {
                content: {
                    'application/json': {
                        schema: errorResponseSchema
                    }
                },
                description: 'Datos inválidos'
            },
            404: {
                description: 'Potrero no encontrado'
            }
        },
        tags: ['Potreros']
    });
    // Control de acceso RBAC
    router.use('/', rbacMiddleware('potreros'));
    router.use('/:id', rbacMiddleware('potreros'));
    // Handlers
    router.openapi(listPaddocksRoute, (c) => paddockController.list(c));
    router.openapi(getPaddockByIdRoute, (c) => paddockController.getById(c));
    router.openapi(registerPaddockRoute, (c) => paddockController.register(c));
    router.openapi(updatePaddockRoute, (c) => paddockController.update(c));
    return router;
}
