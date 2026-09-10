import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
import { MedicalHistory as MedicalHistoryModel } from "../models/MedicalHistory.model.js";
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
        const model = await MedicalHistoryModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        const models = await MedicalHistoryModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }
    async findAll() {
        const models = await MedicalHistoryModel.findAll();
        return models.map(this.toDomain);
    }
    async update(medicalHistory) {
        await MedicalHistoryModel.update({
            animalId: medicalHistory.animalId,
            date: medicalHistory.date,
            reason: medicalHistory.reason,
            diagnosis: medicalHistory.diagnosis,
            treatment: medicalHistory.treatment,
            observations: medicalHistory.observations,
            createdBy: medicalHistory.createdBy
        }, {
            where: { id: medicalHistory.id }
        });
    }
    async delete(id) {
        await MedicalHistoryModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new MedicalHistory(model.id, model.animalId, model.date, model.reason, model.diagnosis, model.treatment, model.observations, model.createdBy, model.createdAt, model.updatedAt);
    }
}
