import { Food } from "@domain/entities/Food.js";

export interface FoodRepository {
    save(food: Food): Promise<void>;
    findAll(): Promise<Food[]>;
    findById(id: string): Promise<Food | null>;
}
