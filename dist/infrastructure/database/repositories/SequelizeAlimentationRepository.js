import { Alimentation, weightUnits, frequency } from "../../../domain/entities/Alimentation.js";
import { Alimentation as AlimentationModel } from "../models/Alimentation.model.js";
export class SequelizeAlimentationRepository {
    async save(alimentation) {
        await AlimentationModel.create({
            alimentationId: alimentation.id,
            animalId: alimentation.animalId,
            foodId: alimentation.foodId,
            count: alimentation.count,
            unit: alimentation.unit,
            frequency: alimentation.frequency,
            start_date: alimentation.startDate,
            end_date: alimentation.endDate,
            observations: alimentation.observations
        });
    }
    async findByAnimalId(animalId) {
        const models = await AlimentationModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }
    toDomain(model) {
        return new Alimentation(model.alimentationId, model.animalId, model.foodId, model.count, model.unit, model.frequency, model.start_date, model.end_date, model.observations);
    }
}
