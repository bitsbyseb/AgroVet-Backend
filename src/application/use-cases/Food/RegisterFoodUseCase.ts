import { Food } from "@domain/entities/Food.js";
import type { FoodRepository } from "@domain/repositories/FoodRepository.js";

export class RegisterFoodUseCase {
    constructor(private readonly foodRepository: FoodRepository) {}

    async execute(request: { id: string; name: string; type: string; description: string }): Promise<void> {
        const food = new Food(
            request.id,
            request.name,
            request.type,
            request.description
        );
        await this.foodRepository.save(food);
    }
}
