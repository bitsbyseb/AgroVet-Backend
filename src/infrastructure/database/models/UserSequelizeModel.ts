import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model } from '@sequelize/core';
import { Attribute, NotNull, PrimaryKey, Unique } from '@sequelize/core/decorators-legacy';

export enum UserRole {
    ADMIN = 'administrator',
    VETERINARIAN = 'veterinarian',
    ZOOTECHNICIAN = "zootechnician"
}

export class UserSequelizeModel extends Model<InferAttributes<UserSequelizeModel>, InferCreationAttributes<UserSequelizeModel>> {
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