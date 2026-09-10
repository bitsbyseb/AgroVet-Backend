import { Paddock, type PaddockStatus } from "@domain/entities/Paddock.js";
import type { PaddockRepository } from "@domain/repositories/PaddockRepository.js";
import { Paddock as PaddockModel } from "../models/Paddock.model.js";

export class SequelizePaddockRepository implements PaddockRepository {
    async save(paddock: Paddock): Promise<void> {
        await PaddockModel.create({
            id: paddock.id,
            name: paddock.name,
            area: paddock.area,
            capacity: paddock.capacity,
            status: paddock.status,
            description: paddock.description
        });
    }

    async findById(id: string): Promise<Paddock | null> {
        const model = await PaddockModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByName(name: string): Promise<Paddock | null> {
        const model = await PaddockModel.findOne({ where: { name } });
        if (!model) return null;
        return this.toDomain(model);
    }

    async findAll(): Promise<Paddock[]> {
        const models = await PaddockModel.findAll();
        return models.map((model) => this.toDomain(model));
    }

    async update(paddock: Paddock): Promise<void> {
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

    async delete(id: string): Promise<void> {
        await PaddockModel.destroy({ where: { id } });
    }

    private toDomain(model: PaddockModel): Paddock {
        return new Paddock(
            model.id,
            model.name,
            model.capacity,
            model.area !== null && model.area !== undefined ? Number(model.area) : null,
            model.status as PaddockStatus,
            model.description,
            model.createdAt,
            model.updatedAt
        );
    }
}
