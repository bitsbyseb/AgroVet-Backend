import { ProductionData, ProductionPurpose } from "../../../domain/entities/ProductionData.js";
import { ProductionData as ProductionModel } from "../models/ProductionData.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
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
        if (!animalId || animalId.trim() === '')
            return [];
        const where = cleanWhereClause({ animalId });
        const models = await ProductionModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    toDomain(model) {
        return new ProductionData(model.id, model.animalId, model.weight, model.milkProduction, model.purpose, model.recordDate);
    }
}
