import { Owner } from "../../../domain/entities/Owner.js";
import { Owner as OwnerModel } from '../../database/models/Owner.model.js';
export class SequelizeOwnerRepository {
    async save(owner) {
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
    async findById(id) {
        const ownerModel = await OwnerModel.findByPk(id);
        if (!ownerModel)
            return null;
        return this.toDomain(ownerModel);
    }
    async findByDocument(document) {
        const ownerModel = await OwnerModel.findOne({ where: { document } });
        if (!ownerModel)
            return null;
        return this.toDomain(ownerModel);
    }
    async findAll() {
        const owners = await OwnerModel.findAll();
        return owners.map(this.toDomain);
    }
    async update(owner) {
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
    async delete(id) {
        await OwnerModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new Owner(model.id, model.name, model.document, model.phone, model.email, model.address, model.ownerType, model.createdAt, model.updatedAt);
    }
}
