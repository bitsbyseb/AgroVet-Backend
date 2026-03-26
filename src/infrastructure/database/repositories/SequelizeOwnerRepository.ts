import { Owner, type OwnerType } from "@domain/entities/Owner.js";
import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";
import { Owner as OwnerModel } from "../models/Owner.model.js";

export class SequelizeOwnerRepository implements OwnerRepository {
    async save(owner: Owner): Promise<void> {
        await OwnerModel.create({
            id: owner.id,
            name: owner.name,
            document: owner.document,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType
        });
    }

    async findById(id: string): Promise<Owner | null> {
        const ownerModel = await OwnerModel.findByPk(id);
        if (!ownerModel) return null;
        return this.toDomain(ownerModel);
    }

    async findByDocument(document: string): Promise<Owner | null> {
        const ownerModel = await OwnerModel.findOne({ where: { document } });
        if (!ownerModel) return null;
        return this.toDomain(ownerModel);
    }

    async findAll(): Promise<Owner[]> {
        const owners = await OwnerModel.findAll();
        return owners.map(this.toDomain);
    }

    async update(owner: Owner): Promise<void> {
        await OwnerModel.update({
            name: owner.name,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType
        }, {
            where: { id: owner.id }
        });
    }

    async delete(id: string): Promise<void> {
        await OwnerModel.destroy({ where: { id } });
    }

    private toDomain(model: OwnerModel): Owner {
        return new Owner(
            model.id,
            model.name,
            model.document,
            model.phone,
            model.email,
            model.address,
            model.ownerType as unknown as OwnerType,
            model.createdAt,
            model.updatedAt
        );
    }
}
