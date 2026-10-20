import { ProductionData, ProductionPurpose } from "@domain/entities/ProductionData.js";
import type { ProductionDataRepository } from "@domain/repositories/ProductionDataRepository.js";
import { ProductionData as ProductionModel } from "../models/ProductionData.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";

export class SequelizeProductionDataRepository implements ProductionDataRepository {
    async save(productionData: ProductionData): Promise<void> {
        await ProductionModel.create({
            id: productionData.id,
            animalId: productionData.animalId,
            weight: productionData.weight,
            milkProduction: productionData.milkProduction,
            purpose: productionData.purpose as any,
            recordDate: productionData.recordDate
        });
    }

    async findByAnimalId(animalId: string): Promise<ProductionData[]> {
        if (!animalId || animalId.trim() === '') return [];
        const where = cleanWhereClause({ animalId });
        const models = await ProductionModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }

    private toDomain(model: ProductionModel): ProductionData {
        return new ProductionData(
            model.id,
            model.animalId,
            model.weight,
            model.milkProduction,
            model.purpose as ProductionPurpose,
            model.recordDate
        );
    }
}
