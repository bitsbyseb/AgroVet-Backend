import { ProductionData, ProductionPurpose } from "../../../domain/entities/ProductionData.js";
export class RegisterProductionUseCase {
    productionRepository;
    animalRepository;
    constructor(productionRepository, animalRepository) {
        this.productionRepository = productionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal)
            throw new Error("Animal not found");
        const production = new ProductionData(request.id, request.animalId, request.weight, request.milkProduction, request.purpose, request.recordDate);
        await this.productionRepository.save(production);
    }
}
