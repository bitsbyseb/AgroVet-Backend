import { Reproduction, ReproductiveStatus, BreedingType } from "../../../domain/entities/Reproduction.js";
import { ReproductionData as ReproductionModel } from "../models/Reproduction.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
export class SequelizeReproductionRepository {
    async save(reproduction) {
        await ReproductionModel.create(this.toPersistence(reproduction));
    }
    async findById(id) {
        if (!id || id.trim() === '')
            return null;
        const model = await ReproductionModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '')
            return [];
        const where = cleanWhereClause({ animalId });
        const models = await ReproductionModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    async findAll() {
        const models = await ReproductionModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(reproduction) {
        if (!reproduction.id || reproduction.id.trim() === '')
            return;
        const persistenceData = this.toPersistence(reproduction);
        const { id, ...dataToUpdate } = persistenceData;
        await ReproductionModel.update(dataToUpdate, {
            where: cleanWhereClause({ id: reproduction.id })
        });
    }
    async delete(id) {
        if (!id || id.trim() === '')
            return;
        await ReproductionModel.destroy({
            where: cleanWhereClause({ id })
        });
    }
    /**
     * Mapper de Dominio a Persistencia (Sequelize Model Attributes)
     */
    toPersistence(entity) {
        return {
            id: entity.id,
            animalId: entity.animalId,
            reproductiveStatus: entity.reproductiveStatus,
            lastCalvingDate: entity.lastCalvingDate ?? null,
            offspringCount: entity.offspringCount,
            breedingType: entity.breedingType ?? null,
            heatDate: entity.heatDate ? new Date(entity.heatDate) : null,
            expectedCalvingDate: entity.expectedCalvingDate ? new Date(entity.expectedCalvingDate) : null,
            bullId: entity.bullId ?? null,
            semenBatch: entity.semenBatch ?? null,
            inseminationDetails: entity.inseminationDetails ?? null
        };
    }
    /**
     * Mapper de Persistencia a Dominio (Reproduction Entity)
     */
    toDomain(model) {
        return new Reproduction(model.id, model.animalId, model.reproductiveStatus, model.lastCalvingDate, model.offspringCount, model.breedingType, model.heatDate ? new Date(model.heatDate) : null, model.expectedCalvingDate ? new Date(model.expectedCalvingDate) : null, model.bullId, model.semenBatch, model.inseminationDetails, model.createdAt, model.updatedAt);
    }
}
