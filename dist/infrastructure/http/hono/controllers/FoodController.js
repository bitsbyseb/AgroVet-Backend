import { RegisterFoodUseCase } from '../../../../application/use-cases/Food/RegisterFoodUseCase.js';
import { ListFoodsUseCase } from '../../../../application/use-cases/Food/ListFoodsUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';
export class FoodController {
    registerFoodUseCase;
    listFoodsUseCase;
    constructor(registerFoodUseCase, listFoodsUseCase) {
        this.registerFoodUseCase = registerFoodUseCase;
        this.listFoodsUseCase = listFoodsUseCase;
    }
    async register(c) {
        try {
            const data = c.req.valid('json');
            const foodData = {
                id: randomUUID(),
                ...data
            };
            await this.registerFoodUseCase.execute(foodData);
            return c.json({ message: 'Food registered successfully', id: foodData.id }, 201);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al registrar alimento', 400);
        }
    }
    async list(c) {
        try {
            const foods = await this.listFoodsUseCase.execute();
            return c.json(foods);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al listar alimentos', 500);
        }
    }
}
