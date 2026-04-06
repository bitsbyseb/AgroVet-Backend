import { Hono } from 'hono';
import { FoodController } from '../controllers/FoodController.js';
import { foodValidator } from '../validators/FoodValidator.js';

export function createFoodRouter(foodController: FoodController) {
    const router = new Hono();

    router.get('/', (c) => foodController.list(c));
    router.post('/', foodValidator, (c) => foodController.register(c));

    return router;
}
