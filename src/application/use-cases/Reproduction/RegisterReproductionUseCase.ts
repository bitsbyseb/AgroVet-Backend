import { Reproduction, ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";
import type { ReproductionRepository } from "@domain/repositories/ReproductionRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class RegisterReproductionUseCase {
    constructor(
        private readonly reproductionRepository: ReproductionRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(request: {
        id: string;
        animalId: string;
        reproductiveStatus: ReproductiveStatus;
        lastCalvingDate: string | null;
        offspringCount: number;
        breedingType: BreedingType | null;
    }): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) throw new Error("Animal not found");

        const reproduction = new Reproduction(
            request.id,
            request.animalId,
            request.reproductiveStatus,
            request.lastCalvingDate,
            request.offspringCount,
            request.breedingType
        );

        await this.reproductionRepository.save(reproduction);
    }
}
