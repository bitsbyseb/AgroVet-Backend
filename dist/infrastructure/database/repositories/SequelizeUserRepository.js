import { User, UserRole } from '../../../domain/entities/User.js';
import { User as UserModel } from '../../database/models/User.model.js';
export class SequelizeUserRepository {
    async findByEmail(email) {
        const userModel = await UserModel.findOne({ where: { email } });
        if (!userModel)
            return null;
        return this.toDomain(userModel);
    }
    async save(user) {
        const primitives = user.toPrimitives();
        await UserModel.upsert({
            id: primitives.id,
            username: primitives.username,
            email: primitives.email,
            password: primitives.password,
            role: primitives.role, // Cast to any to handle Sequelize enum mapping if needed
        });
    }
    async findById(id) {
        const userModel = await UserModel.findByPk(id);
        if (!userModel)
            return null;
        return this.toDomain(userModel);
    }
    toDomain(userModel) {
        return new User({
            id: userModel.id,
            username: userModel.username,
            email: userModel.email,
            password: userModel.password,
            role: userModel.role,
            createdAt: userModel.createdAt,
            updatedAt: userModel.updatedAt,
        });
    }
}
