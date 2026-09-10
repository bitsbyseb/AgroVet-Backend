import { Vaccination } from "../../../domain/entities/Vaccination.js";
import { Vaccination as VaccinationModel } from "../models/Vaccination.model.js";
export class SequelizeVaccinationRepository {
    async save(vaccination) {
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
    async findById(id) {
        const model = await VaccinationModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        const models = await VaccinationModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }
    async findAll() {
        const models = await VaccinationModel.findAll();
        return models.map(this.toDomain);
    }
    async update(vaccination) {
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
    async delete(id) {
        await VaccinationModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new Vaccination(model.id, model.animalId, model.vaccineName, model.applicationDate, model.nextDoseDate, model.batchNumber, model.administeredBy, model.createdAt, model.updatedAt);
    }
}
