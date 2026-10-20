import { Reproduction, ReproductiveStatus, BreedingType } from "../../../domain/entities/Reproduction.js";
import { ReproductionData as ReproductionModel } from "../models/Reproduction.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
export class SequelizeReproductionRepository {
    async save(reproduction) {
        await ReproductionModel.create({
            id: reproduction.id,
            animalId: reproduction.animalId,
            reproductiveStatus: reproduction.reproductiveStatus,
            lastCalvingDate: reproduction.lastCalvingDate,
            offspringCount: reproduction.offspringCount,
            breedingType: reproduction.breedingType
        });
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '')
            return [];
        const where = cleanWhereClause({ animalId });
        const models = await ReproductionModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    toDomain(model) {
        return new Reproduction(model.id, model.animalId, model.reproductiveStatus, model.lastCalvingDate, model.offspringCount, model.breedingType);
    }
}
