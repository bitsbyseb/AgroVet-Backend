import { Animal, animalType, speciesType, Gender } from "@domain/entities/Animal.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';

export class SequelizeAnimalRepository implements AnimalRepository {
    async save(animal: Animal): Promise<void> {
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

    async findById(id: string): Promise<Animal | null> {
        const model = await AnimalModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByOwnerId(ownerId: string): Promise<Animal[]> {
        const models = await AnimalModel.findAll({ where: { ownerId } });
        return models.map(this.toDomain);
    }

    async findAll(): Promise<Animal[]> {
        const models = await AnimalModel.findAll();
        return models.map(this.toDomain);
    }

    async update(animal: Animal): Promise<void> {
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

    async delete(id: string): Promise<void> {
        await AnimalModel.destroy({ where: { id } });
    }

    private toDomain(model: AnimalModel): Animal {
        return new Animal(
            model.id,
            model.name,
            model.species,
            model.animalType,
            model.breed,
            model.gender,
            model.birthDate,
            model.status,
            model.color,
            model.ownerId,
            model.paddockId
        );
    }
}
