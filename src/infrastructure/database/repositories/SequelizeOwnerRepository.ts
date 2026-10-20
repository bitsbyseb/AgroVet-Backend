import { Owner, type OwnerType } from "@domain/entities/Owner.js";
import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { User as UserModel, UserRole } from '@infrastructure/database/models/User.model.js';
import { cleanWhereClause, isValidUuid } from "../utils/whereHelper.js";
import { randomUUID } from 'node:crypto';

export class SequelizeOwnerRepository implements OwnerRepository {
    async save(owner: Owner): Promise<void> {
        await OwnerModel.create({
            id: owner.id,
            name: owner.name,
            document: owner.document,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType,
            userId: owner.userId ?? null
        });
    }

    async findById(id: string): Promise<Owner | null> {
        if (!id || id.trim() === '' || !isValidUuid(id)) return null;
        const ownerModel = await OwnerModel.findByPk(id);
        if (!ownerModel) return null;
        return this.toDomain(ownerModel);
    }

    async findByDocument(document: string): Promise<Owner | null> {
        if (!document || document.trim() === '') return null;
        const where = cleanWhereClause({ document });
        const ownerModel = await OwnerModel.findOne({ where });
        if (!ownerModel) return null;
        return this.toDomain(ownerModel);
    }

    async findByEmail(email: string): Promise<Owner | null> {
        if (!email || email.trim() === '') return null;
        const where = cleanWhereClause({ email });
        const ownerModel = await OwnerModel.findOne({ where });
        if (!ownerModel) return null;
        return this.toDomain(ownerModel);
    }

    async findByUserId(userId: string): Promise<Owner | null> {
        if (!userId || userId.trim() === '' || !isValidUuid(userId)) return null;
        const where = cleanWhereClause({ userId });
        const ownerModel = await OwnerModel.findOne({ where });
        if (ownerModel) {
            return this.toDomain(ownerModel);
        }

        // Auto-healing: Si no está enlazado por userId, intentar vincular por email
        const user = await UserModel.findByPk(userId);
        if (user && user.email) {
            const ownerByEmail = await OwnerModel.findOne({ where: { email: user.email } });
            if (ownerByEmail) {
                await ownerByEmail.update({ userId });
                return this.toDomain(ownerByEmail);
            }

            // Si el usuario tiene rol OWNER pero nunca se le creó ficha en owners, auto-crearla para evitar 404
            if (user.role === UserRole.OWNER) {
                const autoOwner = await OwnerModel.create({
                    id: randomUUID(),
                    name: user.username,
                    document: `CC-${user.id.slice(0, 8)}`,
                    phone: 'Sin teléfono',
                    email: user.email,
                    address: 'Sin dirección registrada',
                    ownerType: 'urban' as any,
                    userId: user.id
                });
                return this.toDomain(autoOwner);
            }
        }

        return null;
    }

    async findAll(): Promise<Owner[]> {
        const owners = await OwnerModel.findAll();
        return owners.map(this.toDomain);
    }

    async update(owner: Owner): Promise<void> {
        if (!owner.id || owner.id.trim() === '' || !isValidUuid(owner.id)) return;
        await OwnerModel.update({
            name: owner.name,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType,
            userId: owner.userId ?? null
        }, {
            where: cleanWhereClause({ id: owner.id })
        });
    }

    async delete(id: string): Promise<void> {
        if (!id || id.trim() === '' || !isValidUuid(id)) return;
        await OwnerModel.destroy({
            where: cleanWhereClause({ id })
        });
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
            model.userId ?? null,
            model.createdAt,
            model.updatedAt
        );
    }
}
