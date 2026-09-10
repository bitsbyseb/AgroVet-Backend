import { ProductionData, ProductionPurpose } from "../../../domain/entities/ProductionData.js";
import { ProductionData as ProductionModel } from "../models/ProductionData.model.js";
export class SequelizeProductionDataRepository {
    async save(productionData) {
        await ProductionModel.create({
            id: productionData.id,
            animalId: productionData.animalId,
            weight: productionData.weight,
            milkProduction: productionData.milkProduction,
            purpose: productionData.purpose,
            recordDate: productionData.recordDate
        });
    }
    async findByAnimalId(animalId) {
        const models = await ProductionModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }
    toDomain(model) {
        return new ProductionData(model.id, model.animalId, model.weight, model.milkProduction, model.purpose, model.recordDate);
    }
}
