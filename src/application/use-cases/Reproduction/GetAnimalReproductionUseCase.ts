import { Reproduction } from "@domain/entities/Reproduction.js";
import type { ReproductionRepository } from "@domain/repositories/ReproductionRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class GetAnimalReproductionUseCase {
    constructor(
        private readonly reproductionRepository: ReproductionRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(animalId: string): Promise<Reproduction[]> {
        const animal = await this.animalRepository.findById(animalId);
        if (!animal) throw new Error("Animal not found");

        return await this.reproductionRepository.findByAnimalId(animalId);
    }
}
