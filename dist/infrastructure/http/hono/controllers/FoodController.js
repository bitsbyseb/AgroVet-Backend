import { RegisterFoodUseCase } from '../../../../application/use-cases/Food/RegisterFoodUseCase.js';
import { ListFoodsUseCase } from '../../../../application/use-cases/Food/ListFoodsUseCase.js';
import { v4 as uuidv4 } from 'uuid';
export class FoodController {
    registerFoodUseCase;
    listFoodsUseCase;
    constructor(registerFoodUseCase, listFoodsUseCase) {
        this.registerFoodUseCase = registerFoodUseCase;
        this.listFoodsUseCase = listFoodsUseCase;
    }
    async register(c) {
        const data = c.req.valid('json');
        try {
            const foodData = {
                id: uuidv4(),
                ...data
            };
            await this.registerFoodUseCase.execute(foodData);
            return c.json({ message: 'Food registered successfully', id: foodData.id }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async list(c) {
        try {
            const foods = await this.listFoodsUseCase.execute();
            return c.json(foods);
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    }
}
