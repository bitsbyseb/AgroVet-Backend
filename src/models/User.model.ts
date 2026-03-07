import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from '@sequelize/core';
import { Attribute, NotNull, PrimaryKey, Unique } from '@sequelize/core/decorators-legacy';

enum UserRole {
    ADMIN = 'administrator',
    VETERINARIAN = 'veterinarian',
    ZOOTECNISTA = "zootechnician"
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.UUID)
    @NotNull
    @Unique
    @PrimaryKey
    declare id: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare username: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare email: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;

    @Attribute(DataTypes.ENUM(...Object.values(UserRole)))
    declare role: UserRole;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}