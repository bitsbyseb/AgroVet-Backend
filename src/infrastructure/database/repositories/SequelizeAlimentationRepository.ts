import { Alimentation, weightUnits, frequency } from "@domain/entities/Alimentation.js";
import type { AlimentationRepository } from "@domain/repositories/AlimentationRepository.js";
import { Alimentation as AlimentationModel } from "../models/Alimentation.model.js";

export class SequelizeAlimentationRepository implements AlimentationRepository {
    async save(alimentation: Alimentation): Promise<void> {
        await AlimentationModel.create({
            alimentationId: alimentation.id,
            animalId: alimentation.animalId,
            foodId: alimentation.foodId,
            count: alimentation.count,
            unit: alimentation.unit as any,
            frequency: alimentation.frequency as any,
            start_date: alimentation.startDate,
            end_date: alimentation.endDate,
            observations: alimentation.observations
        });
    }

    async findByAnimalId(animalId: string): Promise<Alimentation[]> {
        const models = await AlimentationModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }

    private toDomain(model: AlimentationModel): Alimentation {
        return new Alimentation(
            model.alimentationId,
            model.animalId,
            model.foodId,
            model.count,
            model.unit as weightUnits,
            model.frequency as frequency,
            model.start_date,
            model.end_date,
            model.observations
        );
    }
}
