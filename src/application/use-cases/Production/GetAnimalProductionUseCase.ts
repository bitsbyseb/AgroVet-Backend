import { ProductionData } from "@domain/entities/ProductionData.js";
import type { ProductionDataRepository } from "@domain/repositories/ProductionDataRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class GetAnimalProductionUseCase {
    constructor(
        private readonly productionRepository: ProductionDataRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(animalId: string): Promise<ProductionData[]> {
        const animal = await this.animalRepository.findById(animalId);
        if (!animal) throw new Error("Animal not found");

        return await this.productionRepository.findByAnimalId(animalId);
    }
}
