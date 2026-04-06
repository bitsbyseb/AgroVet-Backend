import { Hono } from 'hono';
import { FoodController } from '../controllers/FoodController.js';
import { foodValidator } from '../validators/FoodValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';

export function createFoodRouter(foodController: FoodController) {
    const router = new Hono();

    router.use('*', authMiddleware);

    router.get('/', rbacMiddleware('alimentacion'), (c) => foodController.list(c));
    router.post('/', rbacMiddleware('alimentacion'), foodValidator, (c) => foodController.register(c));

    return router;
}
