import { Vaccination } from "../../../domain/entities/Vaccination.js";
import { Vaccination as VaccinationModel } from "../models/Vaccination.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
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
        if (!id || id.trim() === '')
            return null;
        const model = await VaccinationModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '')
            return [];
        const where = cleanWhereClause({ animalId });
        const models = await VaccinationModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    async findAll() {
        const models = await VaccinationModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(vaccination) {
        if (!vaccination.id || vaccination.id.trim() === '')
            return;
        await VaccinationModel.update({
            animalId: vaccination.animalId,
            vaccineName: vaccination.vaccineName,
            applicationDate: vaccination.applicationDate,
            nextDoseDate: vaccination.nextDoseDate,
            batchNumber: vaccination.batchNumber,
            administeredBy: vaccination.administeredBy
        }, {
            where: cleanWhereClause({ id: vaccination.id })
        });
    }
    async delete(id) {
        if (!id || id.trim() === '')
            return;
        await VaccinationModel.destroy({
            where: cleanWhereClause({ id })
        });
    }
    toDomain(model) {
        return new Vaccination(model.id, model.animalId, model.vaccineName, model.applicationDate, model.nextDoseDate, model.batchNumber, model.administeredBy, model.createdAt, model.updatedAt);
    }
}
