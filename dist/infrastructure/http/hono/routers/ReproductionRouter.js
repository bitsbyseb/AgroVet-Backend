import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { ReproductionController } from '../controllers/ReproductionController.js';
import { reproductionSchema, reproductionResponseSchema, reproductionListResponseSchema, reproductionParamSchema } from '../validators/ReproductionValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
export function createReproductionRouter(reproductionController) {
    const router = new OpenAPIHono();
    // 1. Autenticación JWT obligatoria en todas las rutas del módulo
    router.use('*', authMiddleware);
    // 2. Control de Acceso Basado en Roles (RBAC):
    //    - Zootechnician: Full Access (GET, POST, etc.)
    //    - Administrator & Veterinarian: Solo lectura (GET)
    router.use('*', rbacMiddleware('reproduccion'));
    // Ruta: GET /reproduction/{id} o /reproduction/animal/{id} -> Historial reproductivo
    const getReproductionHistoryRoute = createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Obtener historial reproductivo del animal ordenado cronológicamente',
        description: 'Retorna los eventos reproductivos (celo, montas, inseminación, parto) asociados al animal.',
        security: [{ Bearer: [] }],
        request: {
            params: reproductionParamSchema
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: reproductionListResponseSchema
                    }
                },
                description: 'Historial reproductivo obtenido exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Petición inválida'
            },
            401: { description: 'No autorizado - Token JWT inválido o ausente' },
            403: { description: 'Prohibido - Permisos insuficientes según matriz RBAC' },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Reproducción']
    });
    // Ruta: POST /reproduction/{id} -> Registrar nuevo evento reproductivo
    const registerReproductiveEventRoute = createRoute({
        method: 'post',
        path: '/{id}',
        summary: 'Registrar nuevo evento reproductivo',
        description: 'Registra celo, monta/inseminación con toro/pajilla y calcula o asigna la fecha probable de parto.',
        security: [{ Bearer: [] }],
        request: {
            params: reproductionParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: reproductionSchema
                    }
                }
            }
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string().openapi({ example: 'Reproduction record registered successfully' }),
                            id: z.string().openapi({ example: 'uuid-repro-123' }),
                            record: reproductionResponseSchema.optional()
                        })
                    }
                },
                description: 'Evento reproductivo registrado exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Datos de entrada inválidos o reglas de negocio infringidas'
            },
            401: { description: 'No autorizado' },
            403: { description: 'Prohibido - Requiere rol Zootecnista para registrar' },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Reproducción']
    });
    // Registro de endpoints con sus controladores correspondientes
    router.openapi(getReproductionHistoryRoute, (c) => reproductionController.getReproduction(c));
    router.openapi(registerReproductiveEventRoute, (c) => reproductionController.register(c));
    return router;
}
