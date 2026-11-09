import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { ProductionController } from '../controllers/ProductionController.js';
import {
    productionSchema,
    productionResponseSchema,
    productionParamSchema,
    productionIndicatorsQuerySchema,
    productionIndicatorsResponseSchema
} from '../validators/ProductionValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export function createProductionRouter(productionController: ProductionController) {
    const router = new OpenAPIHono();

    // 1. Autenticación JWT obligatoria
    router.use('*', authMiddleware);

    // 2. Control de Acceso Basado en Roles (RBAC):
    //    - Zootechnician: Full Access (GET, POST)
    //    - Administrator & Veterinarian: Solo lectura (GET)
    router.use('*', rbacMiddleware('datos_productivos'));

    // Ruta: GET /{id} -> Obtener datos de producción de un animal
    const getProductionRoute = createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Obtener datos de producción del animal',
        description: 'Retorna la lista de registros productivos asociados a un animal.',
        security: [{ Bearer: [] }],
        request: {
            params: productionParamSchema
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: z.array(productionResponseSchema)
                    }
                },
                description: 'Registros de producción obtenidos exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Petición inválida'
            },
            401: { description: 'No autorizado' },
            403: { description: 'Prohibido - Permisos insuficientes' },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Producción']
    });

    // Ruta: POST /{id} -> Registrar nuevo dato de producción
    const postProductionRoute = createRoute({
        method: 'post',
        path: '/{id}',
        summary: 'Registrar dato de producción',
        description: 'Registra un lote o evento de producción para el animal especificado.',
        security: [{ Bearer: [] }],
        request: {
            params: productionParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: productionSchema
                    }
                }
            }
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string().openapi({ example: 'Production record registered successfully' }),
                            id: z.string().openapi({ example: 'uuid-prod-123' })
                        })
                    }
                },
                description: 'Dato de producción registrado exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Datos de entrada inválidos'
            },
            401: { description: 'No autorizado' },
            403: { description: 'Prohibido - Requiere rol Zootecnista para registrar' },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Producción']
    });

    // Ruta: GET /{id}/indicators -> HU17: Consultar indicadores productivos
    const getProductionIndicatorsRoute = createRoute({
        method: 'get',
        path: '/{id}/indicators',
        summary: 'Consultar indicadores productivos del animal',
        description: 'Calcula indicadores agregados por período (peso promedio, leche producida, ganancia de peso acumulada) y evolución productiva cronológica.',
        security: [{ Bearer: [] }],
        request: {
            params: productionParamSchema,
            query: productionIndicatorsQuerySchema
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: productionIndicatorsResponseSchema
                    }
                },
                description: 'Indicadores productivos calculados exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Parámetros de consulta inválidos'
            },
            401: { description: 'No autorizado' },
            403: { description: 'Prohibido - Requiere rol Zootechnician o Administrator' },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Producción']
    });

    // Mapeo de rutas a controladores
    router.openapi(getProductionRoute, (c) => productionController.getProduction(c));
    router.openapi(postProductionRoute, (c) => productionController.register(c));
    router.openapi(getProductionIndicatorsRoute, (c) => productionController.getIndicators(c));

    return router;
}
