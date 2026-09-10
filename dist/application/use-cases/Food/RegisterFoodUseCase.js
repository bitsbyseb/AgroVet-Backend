import { Food } from "../../../domain/entities/Food.js";
export class RegisterFoodUseCase {
    foodRepository;
    constructor(foodRepository) {
        this.foodRepository = foodRepository;
    }
    async execute(request) {
        const food = new Food(request.id, request.name, request.type, request.description);
        await this.foodRepository.save(food);
    }
}
