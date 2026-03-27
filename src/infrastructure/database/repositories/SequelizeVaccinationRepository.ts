import { Vaccination } from "@domain/entities/Vaccination.js";
import type { VaccinationRepository } from "@domain/repositories/VaccinationRepository.js";
import { Vaccination as VaccinationModel } from "../models/Vaccination.model.js";

export class SequelizeVaccinationRepository implements VaccinationRepository {
    async save(vaccination: Vaccination): Promise<void> {
        await VaccinationModel.create({
            id: vaccination.id,
            animalId: vaccination.animalId,
            vaccineName: vaccination.vaccineName,
            applicationDate: vaccination.applicationDate,
            nextDoseDate: vaccination.nextDoseDate,
            batchNumber: vaccination.batchNumber,
            administeredBy: vaccination.administeredBy
        });
    }

    async findById(id: string): Promise<Vaccination | null> {
        const model = await VaccinationModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByAnimalId(animalId: string): Promise<Vaccination[]> {
        const models = await VaccinationModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }

    async findAll(): Promise<Vaccination[]> {
        const models = await VaccinationModel.findAll();
        return models.map(this.toDomain);
    }

    async update(vaccination: Vaccination): Promise<void> {
        await VaccinationModel.update({
            animalId: vaccination.animalId,
            vaccineName: vaccination.vaccineName,
            applicationDate: vaccination.applicationDate,
            nextDoseDate: vaccination.nextDoseDate,
            batchNumber: vaccination.batchNumber,
            administeredBy: vaccination.administeredBy
        }, {
            where: { id: vaccination.id }
        });
    }

    async delete(id: string): Promise<void> {
        await VaccinationModel.destroy({ where: { id } });
    }

    private toDomain(model: VaccinationModel): Vaccination {
        return new Vaccination(
            model.id,
            model.animalId,
            model.vaccineName,
            model.applicationDate,
            model.nextDoseDate,
            model.batchNumber,
            model.administeredBy,
            model.createdAt,
            model.updatedAt
        );
    }
}
