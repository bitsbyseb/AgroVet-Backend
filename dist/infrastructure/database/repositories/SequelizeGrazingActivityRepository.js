import { GrazingActivity } from "../../../domain/entities/GrazingActivity.js";
import { GrazingActivity as GrazingActivityModel } from "../models/grazingActivity.model.js";
export class SequelizeGrazingActivityRepository {
    async save(activity) {
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
    async findById(id) {
        const model = await GrazingActivityModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByPaddockId(paddockId) {
        const models = await GrazingActivityModel.findAll({
            where: { paddockId }
        });
        return models.map((model) => this.toDomain(model));
    }
    async findActiveByPaddockId(paddockId) {
        const model = await GrazingActivityModel.findOne({
            where: {
                paddockId,
                exitDate: null
            }
        });
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        const all = await this.findAll();
        return all.filter((activity) => activity.animalIds.includes(animalId));
    }
    async findAll() {
        const models = await GrazingActivityModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(activity) {
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
    async delete(id) {
        await GrazingActivityModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new GrazingActivity(model.id, model.paddockId, Array.isArray(model.animalIds) ? model.animalIds : [], new Date(model.entryDate), model.exitDate ? new Date(model.exitDate) : null, model.rotationNumber, model.observations, model.createdAt, model.updatedAt);
    }
}
