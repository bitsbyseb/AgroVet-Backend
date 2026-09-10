import { Paddock } from "../../../domain/entities/Paddock.js";
import { Paddock as PaddockModel } from "../models/Paddock.model.js";
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
        const model = await PaddockModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByName(name) {
        const model = await PaddockModel.findOne({ where: { name } });
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findAll() {
        const models = await PaddockModel.findAll();
        return models.map((model) => this.toDomain(model));
    }
    async update(paddock) {
        await PaddockModel.update({
            name: paddock.name,
            area: paddock.area,
            capacity: paddock.capacity,
            status: paddock.status,
            description: paddock.description
        }, {
            where: { id: paddock.id }
        });
    }
    async delete(id) {
        await PaddockModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new Paddock(model.id, model.name, model.capacity, model.area !== null && model.area !== undefined ? Number(model.area) : null, model.status, model.description, model.createdAt, model.updatedAt);
    }
}
