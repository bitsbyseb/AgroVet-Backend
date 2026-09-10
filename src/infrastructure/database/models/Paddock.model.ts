import {
    DataTypes,
    Model,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
    type NonAttribute
} from '@sequelize/core';
import {
    Attribute,
    Default,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from '@sequelize/core/decorators-legacy';
import { PaddockStatus } from '@domain/entities/Paddock.js';
import type { Animal } from './Animal.model.js';

@Table({
    tableName: 'paddocks',
    underscored: true
})
export class Paddock extends Model<InferAttributes<Paddock>, InferCreationAttributes<Paddock>> {
    @Attribute(DataTypes.UUID)
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @NotNull
    @Unique
    declare id: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare name: string;

    @Attribute(DataTypes.DECIMAL(10, 2))
    declare area: number | null;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare capacity: number;

    @Attribute(DataTypes.ENUM(...Object.values(PaddockStatus)))
    @NotNull
    @Default(PaddockStatus.ACTIVE)
    declare status: CreationOptional<PaddockStatus>;

    @Attribute(DataTypes.TEXT)
    declare description: string | null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Estructura de relación 1:N (Un potrero tiene muchos animales)
    declare animals?: NonAttribute<Animal[]>;
}
