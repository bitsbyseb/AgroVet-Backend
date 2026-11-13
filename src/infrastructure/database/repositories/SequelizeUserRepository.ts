import type { UserRepository } from '@domain/repositories/UserRepository.js';
import { User, UserRole } from '@domain/entities/User.js';
import { User as UserModel } from '@infrastructure/database/models/User.model.js';
import { cleanWhereClause } from "../utils/whereHelper.js";

export class SequelizeUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        if (!email || email.trim() === '') return null;
        const where = cleanWhereClause({ email });
        const userModel = await UserModel.findOne({ where });
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    async findByUsername(username: string): Promise<User | null> {
        if (!username || username.trim() === '') return null;
        const where = cleanWhereClause({ username });
        const userModel = await UserModel.findOne({ where });
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    async save(user: User): Promise<void> {
        const primitives = user.toPrimitives();
        await UserModel.upsert({
            id: primitives.id,
            username: primitives.username,
            email: primitives.email,
            password: primitives.password,
            role: primitives.role,
        });
    }

    async findById(id: string): Promise<User | null> {
        if (!id || id.trim() === '') return null;
        const userModel = await UserModel.findByPk(id);
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    async findAll(): Promise<User[]> {
        const userModels = await UserModel.findAll();
        return userModels.map((m) => this.toDomain(m));
    }

    async count(): Promise<number> {
        return await UserModel.count();
    }

    private toDomain(userModel: UserModel): User {
        return new User({
            id: userModel.id,
            username: userModel.username,
            email: userModel.email,
            password: userModel.password,
            role: userModel.role as unknown as UserRole,
            createdAt: userModel.createdAt,
            updatedAt: userModel.updatedAt,
        });
    }
}
