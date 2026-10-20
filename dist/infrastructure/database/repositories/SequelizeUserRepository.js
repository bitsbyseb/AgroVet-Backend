import { User, UserRole } from '../../../domain/entities/User.js';
import { User as UserModel } from '../../database/models/User.model.js';
import { cleanWhereClause } from "../utils/whereHelper.js";
export class SequelizeUserRepository {
    async findByEmail(email) {
        if (!email || email.trim() === '')
            return null;
        const where = cleanWhereClause({ email });
        const userModel = await UserModel.findOne({ where });
        if (!userModel)
            return null;
        return this.toDomain(userModel);
    }
    async findByUsername(username) {
        if (!username || username.trim() === '')
            return null;
        const where = cleanWhereClause({ username });
        const userModel = await UserModel.findOne({ where });
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
            role: primitives.role,
        });
    }
    async findById(id) {
        if (!id || id.trim() === '')
            return null;
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
