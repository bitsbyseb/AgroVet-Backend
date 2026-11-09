import { ProductionData, ProductionPurpose } from "../../../domain/entities/ProductionData.js";
import { ProductionData as ProductionModel } from "../models/ProductionData.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
import { Op } from "@sequelize/core";
export class SequelizeProductionDataRepository {
    async save(productionData) {
        await ProductionModel.create({
            id: productionData.id,
            animalId: productionData.animalId,
            weight: productionData.weight,
            milkProduction: productionData.milkProduction,
            purpose: productionData.purpose,
            recordDate: productionData.recordDate,
            productionDate: productionData.productionDate ?? null,
            weightGain: productionData.weightGain ?? null,
            productQuality: productionData.productQuality ?? null
        });
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '')
            return [];
        const where = cleanWhereClause({ animalId });
        const models = await ProductionModel.findAll({ where, order: [['recordDate', 'DESC']] });
        return models.map((model) => this.toDomain(model));
    }
    async findByAnimalIdAndPeriod(animalId, from, to) {
        if (!animalId || animalId.trim() === '')
            return [];
        const models = await ProductionModel.findAll({
            where: {
                animalId,
                recordDate: { [Op.between]: [from, to] }
            },
            order: [['recordDate', 'ASC']]
        });
        return models.map((model) => this.toDomain(model));
    }
    toDomain(model) {
        return new ProductionData(model.id, model.animalId, model.weight, model.milkProduction, model.purpose, model.recordDate, model.productionDate ?? null, model.weightGain ?? null, model.productQuality ?? null);
    }
}
