import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { ownerSchema, updateOwnerSchema, ownerResponseSchema, ownerListResponseSchema, ownerMedicalHistoryParamSchema, ownerMedicalHistoryIdParamSchema, ownerAnimalsResponseSchema, ownerMedicalHistoriesResponseSchema, ownerRemindersQuerySchema, ownerRemindersResponseSchema } from '../validators/OwnerValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
import { animalListResponseSchema } from '../validators/AnimalValidator.js';
export function createOwnerRouter(ownerController) {
    const router = new OpenAPIHono();
    router.use('*', authMiddleware);
    // ─── Rutas de Administración de Propietarios (Rol ADMIN / VET) ───────────
    const listOwnersRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar todos los propietarios',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: ownerListResponseSchema } }, description: 'Lista de propietarios' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno' }
        },
        tags: ['Propietarios']
    });
    const registerOwnerRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar un nuevo propietario',
        security: [{ Bearer: [] }],
        request: { body: { content: { 'application/json': { schema: ownerSchema } } } },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ id: z.uuid() }) } }, description: 'Identificador del nuevo dueño en caso de éxito' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error de validación' }
        },
        tags: ['Propietarios']
    });
    const getOwnerRoute = createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Obtener propietario por ID',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string().uuid({ message: 'El ID de propietario debe ser un UUID válido' }).openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }) }) },
        responses: {
            200: { content: { 'application/json': { schema: ownerResponseSchema } }, description: 'Detalle del propietario' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Propietario no encontrado' }
        },
        tags: ['Propietarios']
    });
    const updateOwnerRoute = createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Actualizar propietario',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({ id: z.string().uuid({ message: 'El ID de propietario debe ser un UUID válido' }) }),
            body: { content: { 'application/json': { schema: updateOwnerSchema } } }
        },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Propietario actualizado' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error de validación' }
        },
        tags: ['Propietarios']
    });
    const deleteOwnerRoute = createRoute({
        method: 'delete',
        path: '/{id}',
        summary: 'Eliminar propietario',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string().uuid({ message: 'El ID de propietario debe ser un UUID válido' }) }) },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Propietario eliminado' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error de eliminación' }
        },
        tags: ['Propietarios']
    });
    const getOwnerAnimalsRoute = createRoute({
        method: 'get',
        path: '/{id}/animals',
        summary: 'Obtener animales de un propietario por su ID',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string().uuid({ message: 'El ID de propietario debe ser un UUID válido' }) }) },
        responses: {
            200: { content: { 'application/json': { schema: animalListResponseSchema } }, description: 'Lista de animales' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error de consulta' }
        },
        tags: ['Propietarios']
    });
    // ─── Rutas del Portal del Propietario (Sprint 11 - Rol OWNER) ────────────
    const getOwnerPortalAnimalsRoute = createRoute({
        method: 'get',
        path: '/owner/animals',
        summary: 'Consultar animales propios del propietario autenticado',
        description: 'Retorna la lista de animales pertenecientes al propietario autenticado extraído del token JWT.',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: ownerAnimalsResponseSchema } }, description: 'Lista de animales pertenecientes al propietario' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Token no válido o no proporcionado' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Perfil de propietario no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    const getOwnerPortalAnimalsRelativeRoute = createRoute({
        method: 'get',
        path: '/animals',
        summary: 'Consultar animales propios (ruta relativa al router /owner)',
        description: 'Retorna la lista de animales pertenecientes al propietario autenticado.',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: ownerAnimalsResponseSchema } }, description: 'Lista de animales pertenecientes al propietario' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Token no válido' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Perfil de propietario no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    const getOwnerPortalMedicalHistoryRoute = createRoute({
        method: 'get',
        path: '/owner/animals/{id}/medical-history',
        summary: 'Consultar historia clínica de un animal propio en modo solo lectura',
        description: 'Retorna la historia clínica completa del animal. Valida estrictamente que pertenezca al propietario.',
        security: [{ Bearer: [] }],
        request: {
            params: ownerMedicalHistoryIdParamSchema
        },
        responses: {
            200: { content: { 'application/json': { schema: ownerMedicalHistoriesResponseSchema } }, description: 'Historia clínica del animal en modo solo lectura' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Identificador del animal inválido' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'No autenticado' },
            403: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Acceso no autorizado: el animal no pertenece a este propietario' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Animal o propietario no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    const getOwnerPortalMedicalHistoryRelativeRoute = createRoute({
        method: 'get',
        path: '/animals/{id}/medical-history',
        summary: 'Consultar historia clínica de un animal propio (relativa)',
        security: [{ Bearer: [] }],
        request: {
            params: ownerMedicalHistoryIdParamSchema
        },
        responses: {
            200: { content: { 'application/json': { schema: ownerMedicalHistoriesResponseSchema } }, description: 'Historia clínica del animal' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Identificador del animal inválido' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'No autenticado' },
            403: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Acceso no autorizado' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Animal o propietario no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    const getOwnerPortalMedicalHistoryWithAnimalIdRoute = createRoute({
        method: 'get',
        path: '/owner/animals/{animalId}/medical-history',
        summary: 'Consultar historia clínica de un animal propio (con parámetro animalId)',
        security: [{ Bearer: [] }],
        request: {
            params: ownerMedicalHistoryParamSchema
        },
        responses: {
            200: { content: { 'application/json': { schema: ownerMedicalHistoriesResponseSchema } }, description: 'Historia clínica del animal' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Identificador del animal inválido' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'No autenticado' },
            403: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Acceso no autorizado' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Animal o propietario no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    const getOwnerPortalMedicalHistoryRelativeAnimalIdRoute = createRoute({
        method: 'get',
        path: '/animals/{animalId}/medical-history',
        summary: 'Consultar historia clínica de un animal propio (relativa con animalId)',
        security: [{ Bearer: [] }],
        request: {
            params: ownerMedicalHistoryParamSchema
        },
        responses: {
            200: { content: { 'application/json': { schema: ownerMedicalHistoriesResponseSchema } }, description: 'Historia clínica del animal' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Identificador del animal inválido' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'No autenticado' },
            403: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Acceso no autorizado' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Animal o propietario no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    // ─── Rutas de Recordatorios del Propietario (Sprint 16 - HU7 / ASIDGA-172 a ASIDGA-174) ───
    const getOwnerPortalRemindersRoute = createRoute({
        method: 'get',
        path: '/owner/reminders',
        summary: 'Consultar recordatorios unificados del propietario autenticado',
        description: 'Retorna la lista unificada de recordatorios futuros y pendientes de vacunaciones, citas y alimentación para los animales del propietario autenticado, soportando filtro opcional por animalId.',
        security: [{ Bearer: [] }],
        request: {
            query: ownerRemindersQuerySchema
        },
        responses: {
            200: { content: { 'application/json': { schema: ownerRemindersResponseSchema } }, description: 'Lista unificada de recordatorios' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Parámetros inválidos' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'No autenticado o token JWT inválido' },
            403: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Acceso no autorizado' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Perfil de propietario o animal no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    const getOwnerPortalRemindersRelativeRoute = createRoute({
        method: 'get',
        path: '/reminders',
        summary: 'Consultar recordatorios unificados (ruta relativa al router /owner)',
        description: 'Retorna la lista de recordatorios futuros y pendientes.',
        security: [{ Bearer: [] }],
        request: {
            query: ownerRemindersQuerySchema
        },
        responses: {
            200: { content: { 'application/json': { schema: ownerRemindersResponseSchema } }, description: 'Lista unificada de recordatorios' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Parámetros inválidos' },
            401: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'No autenticado' },
            403: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Acceso no autorizado' },
            404: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Perfil o animal no encontrado' },
            500: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error interno del servidor' }
        },
        tags: ['Portal Propietario']
    });
    // ─── Asignación de RBAC por ruta ─────────────────────────────────────────
    // 1. Rutas del portal del propietario (Sprint 11 y Sprint 16 - Rol OWNER, ADMIN, VET en solo lectura)
    router.use('/owner/reminders', rbacMiddleware('recordatorios_propietario'));
    router.use('/reminders', rbacMiddleware('recordatorios_propietario'));
    router.use('/owner/animals', rbacMiddleware('portal_propietario'));
    router.use('/owner/animals/*', rbacMiddleware('portal_propietario'));
    router.use('/animals', rbacMiddleware('portal_propietario'));
    router.use('/animals/*', rbacMiddleware('portal_propietario'));
    // 2. Rutas de administración de propietarios (Rol ADMIN / VET)
    router.use('/:id/animals', rbacMiddleware('propietarios'));
    router.use('/:id', async (c, next) => {
        const paramId = c.req.param('id');
        // Si el segmento corresponde a rutas de portal no evaluadas antes, delegar sin bloquear
        if (paramId === 'reminders' || paramId === 'animals') {
            return next();
        }
        return rbacMiddleware('propietarios')(c, next);
    });
    router.use('/', rbacMiddleware('propietarios'));
    // ─── Enlace de Handlers ──────────────────────────────────────────────────
    // 1. Handlers del Portal del Propietario (Sprint 11 y Sprint 16 - Rutas estáticas prioritarias)
    router.openapi(getOwnerPortalRemindersRoute, (c) => ownerController.getOwnerReminders(c));
    router.openapi(getOwnerPortalRemindersRelativeRoute, (c) => ownerController.getOwnerReminders(c));
    router.openapi(getOwnerPortalAnimalsRoute, (c) => ownerController.getOwnerAnimals(c));
    router.openapi(getOwnerPortalAnimalsRelativeRoute, (c) => ownerController.getOwnerAnimals(c));
    router.openapi(getOwnerPortalMedicalHistoryRoute, (c) => ownerController.getOwnerAnimalMedicalHistory(c));
    router.openapi(getOwnerPortalMedicalHistoryRelativeRoute, (c) => ownerController.getOwnerAnimalMedicalHistory(c));
    router.openapi(getOwnerPortalMedicalHistoryWithAnimalIdRoute, (c) => ownerController.getOwnerAnimalMedicalHistory(c));
    router.openapi(getOwnerPortalMedicalHistoryRelativeAnimalIdRoute, (c) => ownerController.getOwnerAnimalMedicalHistory(c));
    // 2. Rutas con sub-recursos
    router.openapi(getOwnerAnimalsRoute, (c) => ownerController.getAnimals(c));
    // 3. Rutas de colección raíz
    router.openapi(listOwnersRoute, (c) => ownerController.list(c));
    router.openapi(registerOwnerRoute, (c) => ownerController.register(c));
    // 4. Rutas comodín por ID (al final para no colisionar)
    router.openapi(getOwnerRoute, (c) => ownerController.getById(c));
    router.openapi(updateOwnerRoute, (c) => ownerController.update(c));
    router.openapi(deleteOwnerRoute, (c) => ownerController.delete(c));
    return router;
}
