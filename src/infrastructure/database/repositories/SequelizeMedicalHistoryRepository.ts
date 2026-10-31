import { MedicalHistory, type PhysiologicalConstants } from "@domain/entities/MedicalHistory.js";
import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import { MedicalHistory as MedicalHistoryModel } from "../models/MedicalHistory.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";

export class SequelizeMedicalHistoryRepository implements MedicalHistoryRepository {
    async save(medicalHistory: MedicalHistory): Promise<void> {
        await MedicalHistoryModel.create(this.toPersistence(medicalHistory));
    }

    async findById(id: string): Promise<MedicalHistory | null> {
        if (!id || id.trim() === '') return null;
        const model = await MedicalHistoryModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByAnimalId(animalId: string): Promise<MedicalHistory[]> {
        if (!animalId || animalId.trim() === '') return [];
        const where = cleanWhereClause({ animalId });
        const models = await MedicalHistoryModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }

    async findAll(): Promise<MedicalHistory[]> {
        const models = await MedicalHistoryModel.findAll();
        return models.map((model) => this.toDomain(model));
    }

    async update(medicalHistory: MedicalHistory): Promise<void> {
        if (!medicalHistory.id || medicalHistory.id.trim() === '') return;
        const persistenceData = this.toPersistence(medicalHistory);
        const { id, ...dataToUpdate } = persistenceData;
        await MedicalHistoryModel.update(dataToUpdate, {
            where: cleanWhereClause({ id: medicalHistory.id })
        });
    }

    async delete(id: string): Promise<void> {
        if (!id || id.trim() === '') return;
        await MedicalHistoryModel.destroy({
            where: cleanWhereClause({ id })
        });
    }

    /**
     * Mapper de Dominio a Persistencia (Sequelize Model Attributes)
     */
    public toPersistence(entity: MedicalHistory) {
        return {
            id: entity.id,
            animalId: entity.animalId,
            date: entity.date,
            reason: entity.reason,
            diagnosis: entity.diagnosis,
            treatment: entity.treatment,
            observations: entity.observations,
            createdBy: entity.createdBy,
            evolution: entity.evolution ?? null,
            physiologicalConstants: entity.physiologicalConstants ?? null,
            weight: entity.weight ?? null,
            bodyConditionScore: entity.bodyConditionScore ?? null
        };
    }

    /**
     * Mapper de Persistencia (Sequelize Model) a Entidad de Dominio
     */
    public toDomain(model: MedicalHistoryModel): MedicalHistory {
        let parsedConstants: PhysiologicalConstants | null = null;
        if (model.physiologicalConstants) {
            parsedConstants = typeof model.physiologicalConstants === 'string'
                ? JSON.parse(model.physiologicalConstants)
                : model.physiologicalConstants;
        }

        return new MedicalHistory(
            model.id,
            model.animalId,
            model.date,
            model.reason,
            model.diagnosis,
            model.treatment,
            model.observations,
            model.createdBy,
            model.evolution ?? null,
            parsedConstants,
            model.weight != null ? Number(model.weight) : null,
            model.bodyConditionScore != null ? Number(model.bodyConditionScore) : null,
            model.createdAt,
            model.updatedAt
        );
    }
}
