import { ProductionData, ProductionPurpose } from "@domain/entities/ProductionData.js";
import type { ProductionDataRepository } from "@domain/repositories/ProductionDataRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class RegisterProductionUseCase {
    constructor(
        private readonly productionRepository: ProductionDataRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(request: {
        id: string;
        animalId: string;
        weight: number | null;
        milkProduction: number | null;
        purpose: ProductionPurpose;
        recordDate: Date;
    }): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) throw new Error("Animal not found");

        const production = new ProductionData(
            request.id,
            request.animalId,
            request.weight,
            request.milkProduction,
            request.purpose,
            request.recordDate
        );

        await this.productionRepository.save(production);
    }
}
