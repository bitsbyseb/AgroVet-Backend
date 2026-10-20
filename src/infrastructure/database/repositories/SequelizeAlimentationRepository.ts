import { Alimentation, weightUnits, frequency } from "@domain/entities/Alimentation.js";
import type { AlimentationRepository } from "@domain/repositories/AlimentationRepository.js";
import { Alimentation as AlimentationModel } from "../models/Alimentation.model.js";
import { cleanWhereClause, isValidUuid } from "../utils/whereHelper.js";

export class SequelizeAlimentationRepository implements AlimentationRepository {
    async save(alimentation: Alimentation): Promise<void> {
        await AlimentationModel.create({
            alimentationId: alimentation.id,
            animalId: alimentation.animalId,
            foodId: alimentation.foodId,
            count: alimentation.count,
            unit: alimentation.unit as any,
            frequency: alimentation.frequency as any,
            startDate: alimentation.startDate,
            endDate: alimentation.endDate,
            observations: alimentation.observations
        });
    }

    async findByAnimalId(animalId: string): Promise<Alimentation[]> {
        if (!animalId || animalId.trim() === '' || !isValidUuid(animalId)) {
            return [];
        }
        const where = cleanWhereClause({ animalId });
        const models = await AlimentationModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }

    private toDomain(model: AlimentationModel): Alimentation {
        return new Alimentation(
            model.alimentationId,
            model.animalId,
            model.foodId,
            model.count,
            model.unit as weightUnits,
            model.frequency as frequency,
            model.startDate ?? (model as any).start_date,
            model.endDate ?? (model as any).end_date,
            model.observations
        );
    }
}
