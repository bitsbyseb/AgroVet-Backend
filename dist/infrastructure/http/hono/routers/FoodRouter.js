import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { FoodController } from '../controllers/FoodController.js';
import { foodSchema, foodResponseSchema, foodListResponseSchema } from '../validators/FoodValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';
export function createFoodRouter(foodController) {
    const router = new OpenAPIHono();
    router.use('*', authMiddleware);
    const listFoodsRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar catálogo de alimentos',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: foodListResponseSchema } }, description: 'Lista de alimentos' }
        },
        tags: ['Catálogo Alimentos']
    });
    const registerFoodRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar un nuevo alimento en catálogo',
        security: [{ Bearer: [] }],
        request: { body: { content: { 'application/json': { schema: foodSchema } } } },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Alimento registrado' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Datos inválidos' }
        },
        tags: ['Catálogo Alimentos']
    });
    router.use('/', rbacMiddleware('alimentacion'));
    router.openapi(listFoodsRoute, (c) => foodController.list(c));
    router.openapi(registerFoodRoute, (c) => foodController.register(c));
    return router;
}
