import { ProductionData } from "../../../domain/entities/ProductionData.js";
export class GetAnimalProductionUseCase {
    productionRepository;
    animalRepository;
    constructor(productionRepository, animalRepository) {
        this.productionRepository = productionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(animalId) {
        const animal = await this.animalRepository.findById(animalId);
        if (!animal)
            throw new Error("Animal not found");
        return await this.productionRepository.findByAnimalId(animalId);
    }
}
