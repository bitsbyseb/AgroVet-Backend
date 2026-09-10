import { Food } from "../../../domain/entities/Food.js";
export class ListFoodsUseCase {
    foodRepository;
    constructor(foodRepository) {
        this.foodRepository = foodRepository;
    }
    async execute() {
        return await this.foodRepository.findAll();
    }
}
