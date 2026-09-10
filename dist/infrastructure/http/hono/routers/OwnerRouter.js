import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { OwnerController } from '../controllers/OwnerController.js';
import { ownerSchema, updateOwnerSchema, ownerResponseSchema, ownerListResponseSchema } from '../validators/OwnerValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
import { animalListResponseSchema } from '../validators/AnimalValidator.js';
export function createOwnerRouter(ownerController) {
    const router = new OpenAPIHono();
    router.use('*', authMiddleware);
    const listOwnersRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar todos los propietarios',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: ownerListResponseSchema } }, description: 'Lista de propietarios' }
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
            201: { content: { 'application/json': { schema: z.object({ id: z.uuid() }) } }, description: 'identificador del nuevo dueño en caso de exito' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Error de validación' }
        },
        tags: ['Propietarios']
    });
    const getOwnerRoute = createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Obtener propietario por ID',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string().openapi({ example: 'uuid-123' }) }) },
        responses: {
            200: { content: { 'application/json': { schema: ownerResponseSchema } }, description: 'Detalle del propietario' },
            404: { description: 'Propietario no encontrado' }
        },
        tags: ['Propietarios']
    });
    const updateOwnerRoute = createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Actualizar propietario',
        security: [{ Bearer: [] }],
        request: {
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: updateOwnerSchema } } }
        },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Propietario actualizado' }
        },
        tags: ['Propietarios']
    });
    const deleteOwnerRoute = createRoute({
        method: 'delete',
        path: '/{id}',
        summary: 'Eliminar propietario',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Propietario eliminado' }
        },
        tags: ['Propietarios']
    });
    const getOwnerAnimalsRoute = createRoute({
        method: 'get',
        path: '/{id}/animals',
        summary: 'Obtener animales de un propietario',
        security: [{ Bearer: [] }],
        request: { params: z.object({ id: z.string() }) },
        responses: {
            200: { content: { 'application/json': { schema: animalListResponseSchema } }, description: 'Lista de animales' }
        },
        tags: ['Propietarios']
    });
    router.use('/', rbacMiddleware('propietarios'));
    router.use('/:id', rbacMiddleware('propietarios'));
    router.use('/:id/animals', rbacMiddleware('propietarios'));
    router.openapi(listOwnersRoute, (c) => ownerController.list(c));
    router.openapi(registerOwnerRoute, (c) => ownerController.register(c));
    router.openapi(getOwnerRoute, (c) => ownerController.getById(c));
    router.openapi(updateOwnerRoute, (c) => ownerController.update(c));
    router.openapi(deleteOwnerRoute, (c) => ownerController.delete(c));
    router.openapi(getOwnerAnimalsRoute, (c) => ownerController.getAnimals(c));
    return router;
}
