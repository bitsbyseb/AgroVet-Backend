import { Alimentation } from "../../../domain/entities/Alimentation.js";
export class GetAnimalDietUseCase {
    alimentationRepository;
    animalRepository;
    constructor(alimentationRepository, animalRepository) {
        this.alimentationRepository = alimentationRepository;
        this.animalRepository = animalRepository;
    }
    async execute(animalId) {
        const animal = await this.animalRepository.findById(animalId);
        if (!animal)
            throw new Error("Animal not found");
        return await this.alimentationRepository.findByAnimalId(animalId);
    }
}
