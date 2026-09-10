import { Reproduction } from "../../../domain/entities/Reproduction.js";
export class GetAnimalReproductionUseCase {
    reproductionRepository;
    animalRepository;
    constructor(reproductionRepository, animalRepository) {
        this.reproductionRepository = reproductionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(animalId) {
        const animal = await this.animalRepository.findById(animalId);
        if (!animal)
            throw new Error("Animal not found");
        return await this.reproductionRepository.findByAnimalId(animalId);
    }
}
