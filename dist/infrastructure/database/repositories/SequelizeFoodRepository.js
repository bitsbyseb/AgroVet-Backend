import { Food } from "../../../domain/entities/Food.js";
import { Food as FoodModel } from "../models/Food.model.js";
export class SequelizeFoodRepository {
    async save(food) {
        await FoodModel.create({
            foodId: food.id,
            name: food.name,
            type: food.type,
            description: food.description
        });
    }
    async findAll() {
        const models = await FoodModel.findAll();
        return models.map(this.toDomain);
    }
    async findById(id) {
        const model = await FoodModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    toDomain(model) {
        return new Food(model.foodId, model.name, model.type, model.description);
    }
}
