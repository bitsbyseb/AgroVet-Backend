import type { UserRepository } from '../../../domain/repositories/UserRepository.js';
import { User, UserRole } from '../../../domain/entities/User.js';
import { UserSequelizeModel } from '../models/UserSequelizeModel.js';

export class SequelizeUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const userModel = await UserSequelizeModel.findOne({ where: { email } });
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    async save(user: User): Promise<void> {
        const primitives = user.toPrimitives();
        await UserSequelizeModel.upsert({
            id: primitives.id,
            username: primitives.username,
            email: primitives.email,
            password: primitives.password,
            role: primitives.role as any, // Cast to any to handle Sequelize enum mapping if needed
        });
    }

    async findById(id: string): Promise<User | null> {
        const userModel = await UserSequelizeModel.findByPk(id);
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    private toDomain(userModel: UserSequelizeModel): User {
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
