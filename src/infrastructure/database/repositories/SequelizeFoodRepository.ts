import { Food } from "@domain/entities/Food.js";
import type { FoodRepository } from "@domain/repositories/FoodRepository.js";
import { Food as FoodModel } from "../models/Food.model.js";

export class SequelizeFoodRepository implements FoodRepository {
    async save(food: Food): Promise<void> {
        await FoodModel.create({
            foodId: food.id,
            name: food.name,
            type: food.type,
            description: food.description
        });
    }

    async findAll(): Promise<Food[]> {
        const models = await FoodModel.findAll();
        return models.map(this.toDomain);
    }

    async findById(id: string): Promise<Food | null> {
        const model = await FoodModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    private toDomain(model: FoodModel): Food {
        return new Food(
            model.foodId,
            model.name,
            model.type,
            model.description
        );
    }
}
