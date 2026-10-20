import { RegisterFoodUseCase } from '@application/use-cases/Food/RegisterFoodUseCase.js';
import { ListFoodsUseCase } from '@application/use-cases/Food/ListFoodsUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';

export class FoodController {
    constructor(
        private registerFoodUseCase: RegisterFoodUseCase,
        private listFoodsUseCase: ListFoodsUseCase
    ) {}

    async register(c: any) {
        try {
            const data = c.req.valid('json');
            const foodData = {
                id: randomUUID(),
                ...data
            };
            await this.registerFoodUseCase.execute(foodData);
            return c.json({ message: 'Food registered successfully', id: foodData.id }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar alimento', 400);
        }
    }

    async list(c: any) {
        try {
            const foods = await this.listFoodsUseCase.execute();
            return c.json(foods);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al listar alimentos', 500);
        }
    }
}
