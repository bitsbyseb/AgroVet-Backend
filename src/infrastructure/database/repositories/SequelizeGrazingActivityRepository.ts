import { GrazingActivity } from "@domain/entities/GrazingActivity.js";
import type { GrazingActivityRepository, IGrazingFilters } from "@domain/repositories/GrazingActivityRepository.js";
import { GrazingActivity as GrazingActivityModel } from "../models/grazingActivity.model.js";
import { Op } from "@sequelize/core";
import { cleanWhereClause, buildJsonArrayContains, isValidUuid } from "../utils/whereHelper.js";

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
        if (!id || id.trim() === '' || !isValidUuid(id)) return null;
        const model = await GrazingActivityModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByPaddockId(paddockId: string): Promise<GrazingActivity[]> {
        if (!paddockId || paddockId.trim() === '' || !isValidUuid(paddockId)) return [];
        const where = cleanWhereClause({ paddockId });
        const models = await GrazingActivityModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }

    async findActiveByPaddockId(paddockId: string): Promise<GrazingActivity | null> {
        if (!paddockId || paddockId.trim() === '' || !isValidUuid(paddockId)) return null;
        const where = {
            ...cleanWhereClause({ paddockId }),
            exitDate: null
        };
        const model = await GrazingActivityModel.findOne({ where });
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByAnimalId(animalId: string): Promise<GrazingActivity[]> {
        if (!animalId || animalId.trim() === '' || !isValidUuid(animalId)) return [];
        const where = cleanWhereClause({
            animalIds: buildJsonArrayContains(animalId)
        });
        const models = await GrazingActivityModel.findAll({ where });
        const activities = models.map((model) => this.toDomain(model));
        return activities.filter((activity) => activity.animalIds.includes(animalId));
    }

    async findHistory(filters: IGrazingFilters = {}): Promise<GrazingActivity[]> {
        const rawWhere: Record<string | symbol, unknown> = {};

        if (filters.paddockId && isValidUuid(filters.paddockId)) {
            rawWhere.paddockId = filters.paddockId;
        }

        if (filters.animalId && isValidUuid(filters.animalId)) {
            rawWhere.animalIds = buildJsonArrayContains(filters.animalId);
        }

        const startDate = filters.startDate ? new Date(filters.startDate) : undefined;
        const endDate = filters.endDate ? new Date(filters.endDate) : undefined;

        if (startDate && endDate) {
            rawWhere.entryDate = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            };
        } else if (startDate) {
            rawWhere.entryDate = {
                [Op.gte]: startDate
            };
        } else if (endDate) {
            rawWhere.entryDate = {
                [Op.lte]: endDate
            };
        }

        const where = cleanWhereClause(rawWhere);

        const models = await GrazingActivityModel.findAll({
            where,
            order: [['entryDate', 'DESC']]
        });

        let activities = models.map((model) => this.toDomain(model));

        if (filters.animalId && filters.animalId.trim() !== '' && isValidUuid(filters.animalId)) {
            activities = activities.filter((activity) => activity.animalIds.includes(filters.animalId!));
        }

        return activities;
    }

    async findAll(): Promise<GrazingActivity[]> {
        const models = await GrazingActivityModel.findAll();
        return models.map((model) => this.toDomain(model));
    }

    async update(activity: GrazingActivity): Promise<void> {
        if (!activity.id || activity.id.trim() === '' || !isValidUuid(activity.id)) return;
        await GrazingActivityModel.update({
            paddockId: activity.paddockId,
            animalIds: activity.animalIds,
            entryDate: activity.entryDate,
            exitDate: activity.exitDate,
            rotationNumber: activity.rotationNumber,
            observations: activity.observations
        }, {
            where: cleanWhereClause({ id: activity.id })
        });
    }

    async delete(id: string): Promise<void> {
        if (!id || id.trim() === '' || !isValidUuid(id)) return;
        await GrazingActivityModel.destroy({
            where: cleanWhereClause({ id })
        });
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
