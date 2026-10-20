import { Animal, animalType, speciesType, Gender } from "../../../domain/entities/Animal.js";
import { Animal as AnimalModel } from '../../database/models/Animal.model.js';
import { cleanWhereClause, isValidUuid } from "../utils/whereHelper.js";
export class SequelizeAnimalRepository {
    async save(animal) {
        await AnimalModel.create({
            id: animal.id,
            name: animal.name,
            species: animal.species,
            animalType: animal.animalType,
            breed: animal.breed,
            gender: animal.gender,
            birthDate: animal.birthDate,
            status: animal.status,
            color: animal.color,
            ownerId: animal.ownerId,
            paddockId: animal.paddockId || null
        });
    }
    async findById(id) {
        if (!id || id.trim() === '' || !isValidUuid(id))
            return null;
        const model = await AnimalModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByOwnerId(ownerId) {
        if (!ownerId || ownerId.trim() === '' || !isValidUuid(ownerId))
            return [];
        const where = cleanWhereClause({ ownerId });
        const models = await AnimalModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }
    async findAll() {
        const models = await AnimalModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(animal) {
        if (!animal.id || animal.id.trim() === '' || !isValidUuid(animal.id))
            return;
        await AnimalModel.update({
            name: animal.name,
            species: animal.species,
            animalType: animal.animalType,
            breed: animal.breed,
            gender: animal.gender,
            birthDate: animal.birthDate,
            status: animal.status,
            color: animal.color,
            ownerId: animal.ownerId,
            paddockId: animal.paddockId || null
        }, {
            where: cleanWhereClause({ id: animal.id })
        });
    }
    async delete(id) {
        if (!id || id.trim() === '' || !isValidUuid(id))
            return;
        await AnimalModel.destroy({
            where: cleanWhereClause({ id })
        });
    }
    toDomain(model) {
        return new Animal(model.id, model.name, model.species, model.animalType, model.breed, model.gender, model.birthDate, model.status, model.color, model.ownerId, model.paddockId);
    }
}
