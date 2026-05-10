import { MedicalHistory } from "@domain/entities/MedicalHistory.js";
import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import { MedicalHistory as MedicalHistoryModel } from "../models/MedicalHistory.model.js";

export class SequelizeMedicalHistoryRepository implements MedicalHistoryRepository {
    async save(medicalHistory: MedicalHistory): Promise<void> {
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

    async findById(id: string): Promise<MedicalHistory | null> {
        const model = await MedicalHistoryModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByAnimalId(animalId: string): Promise<MedicalHistory[]> {
        const models = await MedicalHistoryModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }

    async findAll(): Promise<MedicalHistory[]> {
        const models = await MedicalHistoryModel.findAll();
        return models.map(this.toDomain);
    }

    async update(medicalHistory: MedicalHistory): Promise<void> {
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

    async delete(id: string): Promise<void> {
        await MedicalHistoryModel.destroy({ where: { id } });
    }

    private toDomain(model: MedicalHistoryModel): MedicalHistory {
        return new MedicalHistory(
            model.id,
            model.animalId,
            model.date,
            model.reason,
            model.diagnosis,
            model.treatment,
            model.observations,
            model.createdBy,
            model.createdAt,
            model.updatedAt
        );
    }
}
