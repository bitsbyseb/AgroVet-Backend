import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
import { MedicalHistory as MedicalHistoryModel } from "../models/MedicalHistory.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
export class SequelizeMedicalHistoryRepository {
    async save(medicalHistory) {
        await MedicalHistoryModel.create({
            id: medicalHistory.id,
            animalId: medicalHistory.animalId,
            date: medicalHistory.date,
            reason: medicalHistory.reason,
            diagnosis: medicalHistory.diagnosis,
            treatment: medicalHistory.treatment,
            observations: medicalHistory.observations,
            createdBy: medicalHistory.createdBy
        });
    }
    async findById(id) {
        if (!id || id.trim() === '')
            return null;
        const model = await MedicalHistoryModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '')
            return [];
        const where = cleanWhereClause({ animalId });
        const models = await MedicalHistoryModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    async findAll() {
        const models = await MedicalHistoryModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(medicalHistory) {
        if (!medicalHistory.id || medicalHistory.id.trim() === '')
            return;
        await MedicalHistoryModel.update({
            animalId: medicalHistory.animalId,
            date: medicalHistory.date,
            reason: medicalHistory.reason,
            diagnosis: medicalHistory.diagnosis,
            treatment: medicalHistory.treatment,
            observations: medicalHistory.observations,
            createdBy: medicalHistory.createdBy
        }, {
            where: cleanWhereClause({ id: medicalHistory.id })
        });
    }
    async delete(id) {
        if (!id || id.trim() === '')
            return;
        await MedicalHistoryModel.destroy({
            where: cleanWhereClause({ id })
        });
    }
    toDomain(model) {
        return new MedicalHistory(model.id, model.animalId, model.date, model.reason, model.diagnosis, model.treatment, model.observations, model.createdBy, model.createdAt, model.updatedAt);
    }
}
