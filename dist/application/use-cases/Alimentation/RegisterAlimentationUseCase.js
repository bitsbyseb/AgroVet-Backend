import { Alimentation, weightUnits, frequency } from "../../../domain/entities/Alimentation.js";
export class RegisterAlimentationUseCase {
    alimentationRepository;
    animalRepository;
    foodRepository;
    constructor(alimentationRepository, animalRepository, foodRepository) {
        this.alimentationRepository = alimentationRepository;
        this.animalRepository = animalRepository;
        this.foodRepository = foodRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal)
            throw new Error("Animal not found");
        const food = await this.foodRepository.findById(request.foodId);
        if (!food)
            throw new Error("Food not found");
        const alimentation = new Alimentation(request.id, request.animalId, request.foodId, request.count, request.unit, request.frequency, request.startDate, request.endDate, request.observations);
        await this.alimentationRepository.save(alimentation);
    }
}
