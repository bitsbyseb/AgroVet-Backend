import { Op } from '@sequelize/core';
import { Animal, animalType, speciesType, Gender, Status } from "../../../domain/entities/Animal.js";
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
    async search(params) {
        const criteria = typeof params === 'string' ? { query: params } : (params || {});
        const query = criteria.query?.trim();
        const name = criteria.name?.trim();
        const identification = criteria.identification?.trim();
        const species = criteria.species?.trim();
        const ownerId = criteria.ownerId?.trim();
        const status = criteria.status?.trim();
        if (!query && !name && !identification && !species && !ownerId && !status) {
            return this.findAll();
        }
        const andConditions = [];
        if (query) {
            andConditions.push({
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { id: { [Op.like]: `%${query}%` } }
                ]
            });
        }
        if (name) {
            andConditions.push({ name: { [Op.like]: `%${name}%` } });
        }
        if (identification) {
            andConditions.push({ id: { [Op.like]: `%${identification}%` } });
        }
        if (species) {
            andConditions.push({ species });
        }
        if (ownerId) {
            if (isValidUuid(ownerId)) {
                andConditions.push({ ownerId });
            }
            else {
                return [];
            }
        }
        if (status) {
            andConditions.push({ status });
        }
        const where = andConditions.length === 1 ? andConditions[0] : { [Op.and]: andConditions };
        const models = await AnimalModel.findAll({ where });
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
