import { Alimentation } from "@domain/entities/Alimentation.js";
import type { AlimentationRepository } from "@domain/repositories/AlimentationRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class GetAnimalDietUseCase {
    constructor(
        private readonly alimentationRepository: AlimentationRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(animalId: string): Promise<Alimentation[]> {
        const animal = await this.animalRepository.findById(animalId);
        if (!animal) throw new Error("Animal not found");

        return await this.alimentationRepository.findByAnimalId(animalId);
    }
}
