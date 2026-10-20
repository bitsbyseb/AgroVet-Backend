import { Reproduction, ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";
import type { ReproductionRepository } from "@domain/repositories/ReproductionRepository.js";
import { ReproductionData as ReproductionModel } from "../models/Reproduction.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";

export class SequelizeReproductionRepository implements ReproductionRepository {
    async save(reproduction: Reproduction): Promise<void> {
        await ReproductionModel.create({
            id: reproduction.id,
            animalId: reproduction.animalId,
            reproductiveStatus: reproduction.reproductiveStatus as any,
            lastCalvingDate: reproduction.lastCalvingDate,
            offspringCount: reproduction.offspringCount,
            breedingType: reproduction.breedingType as any
        });
    }

    async findByAnimalId(animalId: string): Promise<Reproduction[]> {
        if (!animalId || animalId.trim() === '') return [];
        const where = cleanWhereClause({ animalId });
        const models = await ReproductionModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }

    private toDomain(model: ReproductionModel): Reproduction {
        return new Reproduction(
            model.id,
            model.animalId,
            model.reproductiveStatus as ReproductiveStatus,
            model.lastCalvingDate,
            model.offspringCount,
            model.breedingType as BreedingType
        );
    }
}
