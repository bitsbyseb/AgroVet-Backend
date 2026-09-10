import { Reproduction, ReproductiveStatus, BreedingType } from "../../../domain/entities/Reproduction.js";
import { ReproductionData as ReproductionModel } from "../models/Reproduction.model.js";
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
        const models = await ReproductionModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }
    toDomain(model) {
        return new Reproduction(model.id, model.animalId, model.reproductiveStatus, model.lastCalvingDate, model.offspringCount, model.breedingType);
    }
}
