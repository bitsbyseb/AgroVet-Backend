import { Paddock } from "../../../domain/entities/Paddock.js";
import { Paddock as PaddockModel } from "../models/Paddock.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";
export class SequelizePaddockRepository {
    async save(paddock) {
        await PaddockModel.create({
            id: paddock.id,
            name: paddock.name,
            area: paddock.area,
            capacity: paddock.capacity,
            status: paddock.status,
            description: paddock.description
        });
    }
    async findById(id) {
        if (!id || id.trim() === '')
            return null;
        const model = await PaddockModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByName(name) {
        if (!name || name.trim() === '')
            return null;
        const where = cleanWhereClause({ name });
        const model = await PaddockModel.findOne({ where });
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findAll() {
        const models = await PaddockModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(paddock) {
        if (!paddock.id || paddock.id.trim() === '')
            return;
        await PaddockModel.update({
            name: paddock.name,
            area: paddock.area,
            capacity: paddock.capacity,
            status: paddock.status,
            description: paddock.description
        }, {
            where: cleanWhereClause({ id: paddock.id })
        });
    }
    async delete(id) {
        if (!id || id.trim() === '')
            return;
        await PaddockModel.destroy({
            where: cleanWhereClause({ id })
        });
    }
    toDomain(model) {
        return new Paddock(model.id, model.name, model.capacity, model.area !== null && model.area !== undefined ? Number(model.area) : null, model.status, model.description, model.createdAt, model.updatedAt);
    }
}
