import { Animal, animalType, speciesType, Gender } from "../../../domain/entities/Animal.js";
import { Animal as AnimalModel } from '../../database/models/Animal.model.js';
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
        const model = await AnimalModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByOwnerId(ownerId) {
        const models = await AnimalModel.findAll({ where: { ownerId } });
        return models.map(this.toDomain);
    }
    async findAll() {
        const models = await AnimalModel.findAll();
        return models.map(this.toDomain);
    }
    async update(animal) {
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
            where: { id: animal.id }
        });
    }
    async delete(id) {
        await AnimalModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new Animal(model.id, model.name, model.species, model.animalType, model.breed, model.gender, model.birthDate, model.status, model.color, model.ownerId, model.paddockId);
    }
}
