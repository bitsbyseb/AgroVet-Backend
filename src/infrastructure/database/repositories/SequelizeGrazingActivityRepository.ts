import { GrazingActivity } from "@domain/entities/GrazingActivity.js";
import type { GrazingActivityRepository } from "@domain/repositories/GrazingActivityRepository.js";
import { GrazingActivity as GrazingActivityModel } from "../models/grazingActivity.model.js";

export class SequelizeGrazingActivityRepository implements GrazingActivityRepository {
    async save(activity: GrazingActivity): Promise<void> {
        await GrazingActivityModel.create({
            id: activity.id,
            paddockId: activity.paddockId,
            animalIds: activity.animalIds,
            entryDate: activity.entryDate,
            exitDate: activity.exitDate,
            rotationNumber: activity.rotationNumber,
            observations: activity.observations
        });
    }

    async findById(id: string): Promise<GrazingActivity | null> {
        const model = await GrazingActivityModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByPaddockId(paddockId: string): Promise<GrazingActivity[]> {
        const models = await GrazingActivityModel.findAll({
            where: { paddockId }
        });
        return models.map((model) => this.toDomain(model));
    }

    async findActiveByPaddockId(paddockId: string): Promise<GrazingActivity | null> {
        const model = await GrazingActivityModel.findOne({
            where: {
                paddockId,
                exitDate: null
            }
        });
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByAnimalId(animalId: string): Promise<GrazingActivity[]> {
        const all = await this.findAll();
        return all.filter((activity) => activity.animalIds.includes(animalId));
    }

    async findAll(): Promise<GrazingActivity[]> {
        const models = await GrazingActivityModel.findAll();
        return models.map((model) => this.toDomain(model));
    }

    async update(activity: GrazingActivity): Promise<void> {
        await GrazingActivityModel.update({
            paddockId: activity.paddockId,
            animalIds: activity.animalIds,
            entryDate: activity.entryDate,
            exitDate: activity.exitDate,
            rotationNumber: activity.rotationNumber,
            observations: activity.observations
        }, {
            where: { id: activity.id }
        });
    }

    async delete(id: string): Promise<void> {
        await GrazingActivityModel.destroy({ where: { id } });
    }

    private toDomain(model: GrazingActivityModel): GrazingActivity {
        return new GrazingActivity(
            model.id,
            model.paddockId,
            Array.isArray(model.animalIds) ? model.animalIds : [],
            new Date(model.entryDate),
            model.exitDate ? new Date(model.exitDate) : null,
            model.rotationNumber,
            model.observations,
            model.createdAt,
            model.updatedAt
        );
    }
}
