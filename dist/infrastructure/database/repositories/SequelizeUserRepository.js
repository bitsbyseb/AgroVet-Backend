import { User, UserRole } from '../../../domain/entities/User.js';
import { UserSequelizeModel } from '../models/UserSequelizeModel.js';
export class SequelizeUserRepository {
    async findByEmail(email) {
        const userModel = await UserSequelizeModel.findOne({ where: { email } });
        if (!userModel)
            return null;
        return this.toDomain(userModel);
    }
    async save(user) {
        const primitives = user.toPrimitives();
        await UserSequelizeModel.upsert({
            id: primitives.id,
            username: primitives.username,
            email: primitives.email,
            password: primitives.password,
            role: primitives.role, // Cast to any to handle Sequelize enum mapping if needed
        });
    }
    async findById(id) {
        const userModel = await UserSequelizeModel.findByPk(id);
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
