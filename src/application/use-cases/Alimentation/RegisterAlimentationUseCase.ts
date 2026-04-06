import { Alimentation, weightUnits, frequency } from "@domain/entities/Alimentation.js";
import type { AlimentationRepository } from "@domain/repositories/AlimentationRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import type { FoodRepository } from "@domain/repositories/FoodRepository.js";

export class RegisterAlimentationUseCase {
    constructor(
        private readonly alimentationRepository: AlimentationRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly foodRepository: FoodRepository
    ) {}

    async execute(request: {
        id: string;
        animalId: string;
        foodId: string;
        count: number;
        unit: weightUnits;
        frequency: frequency;
        startDate: Date;
        endDate: Date;
        observations: string;
    }): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) throw new Error("Animal not found");

        const food = await this.foodRepository.findById(request.foodId);
        if (!food) throw new Error("Food not found");

        const alimentation = new Alimentation(
            request.id,
            request.animalId,
            request.foodId,
            request.count,
            request.unit,
            request.frequency,
            request.startDate,
            request.endDate,
            request.observations
        );

        await this.alimentationRepository.save(alimentation);
    }
}
