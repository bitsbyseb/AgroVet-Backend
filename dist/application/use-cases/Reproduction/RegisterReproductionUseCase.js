import { Reproduction, ReproductiveStatus, BreedingType } from "../../../domain/entities/Reproduction.js";
export class RegisterReproductionUseCase {
    reproductionRepository;
    animalRepository;
    constructor(reproductionRepository, animalRepository) {
        this.reproductionRepository = reproductionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal)
            throw new Error("Animal not found");
        const reproduction = new Reproduction(request.id, request.animalId, request.reproductiveStatus, request.lastCalvingDate, request.offspringCount, request.breedingType);
        await this.reproductionRepository.save(reproduction);
    }
}
