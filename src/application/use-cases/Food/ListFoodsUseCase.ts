import { Food } from "@domain/entities/Food.js";
import type { FoodRepository } from "@domain/repositories/FoodRepository.js";

export class ListFoodsUseCase {
    constructor(private readonly foodRepository: FoodRepository) {}

    async execute(): Promise<Food[]> {
        return await this.foodRepository.findAll();
    }
}
