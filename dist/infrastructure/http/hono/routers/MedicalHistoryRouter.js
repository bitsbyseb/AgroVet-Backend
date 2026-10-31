import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { MedicalHistoryController } from '../controllers/MedicalHistoryController.js';
import { medicalHistorySchema, updateMedicalHistorySchema, medicalHistoryResponseSchema, medicalHistoryListResponseSchema } from '../validators/MedicalHistoryValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
export function createMedicalHistoryRouter(medicalHistoryController) {
    const router = new OpenAPIHono();
    // 1. Autenticación y RBAC global para este router ('historial_medico')
    // Full Access: veterinarian | Read-Only (GET): zootechnician, administrator
    router.use('*', authMiddleware);
    router.use('*', rbacMiddleware('historial_medico'));
    // 2. Ruta GET: Consultar historial clínico enriquecido por animal (HU8/HU9)
    const getHistoryByAnimalRoute = createRoute({
        method: 'get',
        path: '/animal/{animalId}',
        summary: 'Obtener historial médico del animal',
        description: 'Retorna el historial clínico enriquecido con evolución, constantes fisiológicas y medidas.',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({
                animalId: z.string().openapi({ example: 'uuid-animal-123', description: 'ID del animal' })
            })
        },
        responses: {
            200: {
                content: { 'application/json': { schema: medicalHistoryListResponseSchema } },
                description: 'Historial médico enriquecido'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Parámetros inválidos'
            },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Historial Médico']
    });
    // 3. Ruta POST: Crear nueva consulta/evento médico enriquecido (HU8)
    const createHistoryRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar evento médico enriquecido',
        description: 'Registra una atención médica incluyendo evolución, constantes fisiológicas y medidas corporales.',
        security: [{ Bearer: [] }],
        request: {
            body: {
                content: { 'application/json': { schema: medicalHistorySchema } }
            }
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: medicalHistoryResponseSchema.optional()
                        })
                    }
                },
                description: 'Evento médico registrado con éxito'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Datos inválidos'
            },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Historial Médico']
    });
    // 4. Ruta POST específica: Registrar evento médico para un animal en su URL
    const createHistoryForAnimalRoute = createRoute({
        method: 'post',
        path: '/animal/{animalId}',
        summary: 'Registrar evento médico para un animal específico',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({
                animalId: z.string().openapi({ example: 'uuid-animal-123', description: 'ID del animal' })
            }),
            body: {
                content: { 'application/json': { schema: medicalHistorySchema } }
            }
        },
        responses: {
            201: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: medicalHistoryResponseSchema.optional()
                        })
                    }
                },
                description: 'Evento médico registrado'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Datos inválidos'
            },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Animal no encontrado'
            }
        },
        tags: ['Historial Médico']
    });
    // 5. Ruta PUT: Actualizar registro de historia médica (HU8/HU9)
    const updateHistoryRoute = createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Actualizar registro de historial médico',
        description: 'Permite actualizar evolución clínica, constantes fisiológicas y medidas de un registro existente.',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({
                id: z.string().openapi({ example: 'uuid-hist-123', description: 'ID del historial médico' })
            }),
            body: {
                content: { 'application/json': { schema: updateMedicalHistorySchema } }
            }
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            data: medicalHistoryResponseSchema.optional()
                        })
                    }
                },
                description: 'Historial médico actualizado exitosamente'
            },
            400: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Datos inválidos'
            },
            404: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Historial médico no encontrado'
            }
        },
        tags: ['Historial Médico']
    });
    // Vinculación de rutas con el controlador
    router.openapi(getHistoryByAnimalRoute, (c) => medicalHistoryController.listByAnimal(c));
    router.openapi(createHistoryRoute, (c) => medicalHistoryController.create(c));
    router.openapi(createHistoryForAnimalRoute, (c) => medicalHistoryController.create(c));
    router.openapi(updateHistoryRoute, (c) => medicalHistoryController.update(c));
    return router;
}
