import { Alimentation, weightUnits, frequency } from "../../../domain/entities/Alimentation.js";
import { Alimentation as AlimentationModel } from "../models/Alimentation.model.js";
import { cleanWhereClause, isValidUuid } from "../utils/whereHelper.js";
export class SequelizeAlimentationRepository {
    async save(alimentation) {
        await AlimentationModel.create({
            alimentationId: alimentation.id,
            animalId: alimentation.animalId,
            foodId: alimentation.foodId,
            count: alimentation.count,
            unit: alimentation.unit,
            frequency: alimentation.frequency,
            startDate: alimentation.startDate,
            endDate: alimentation.endDate,
            observations: alimentation.observations
        });
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '' || !isValidUuid(animalId)) {
            return [];
        }
        const where = cleanWhereClause({ animalId });
        const models = await AlimentationModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    toDomain(model) {
        return new Alimentation(model.alimentationId, model.animalId, model.foodId, model.count, model.unit, model.frequency, model.startDate ?? model.start_date, model.endDate ?? model.end_date, model.observations);
    }
}
