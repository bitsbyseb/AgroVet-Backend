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
import type { Paddock } from './Paddock.model.js';
import type { Animal } from './Animal.model.js';

@Table({
    tableName: 'grazing_activities',
    underscored: true
})
export class GrazingActivity extends Model<InferAttributes<GrazingActivity>, InferCreationAttributes<GrazingActivity>> {
    @Attribute(DataTypes.UUID)
    @PrimaryKey
    @Default(DataTypes.UUIDV4)
    @NotNull
    @Unique
    declare id: CreationOptional<string>;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare paddockId: string;

    @Attribute(DataTypes.JSON)
    @NotNull
    @Default([])
    declare animalIds: CreationOptional<string[]>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare entryDate: Date;

    @Attribute(DataTypes.DATE)
    declare exitDate: CreationOptional<Date | null>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare rotationNumber: number;

    @Attribute(DataTypes.TEXT)
    declare observations: CreationOptional<string | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // Asociaciones (NonAttribute)
    declare paddock?: NonAttribute<Paddock>;
    declare animals?: NonAttribute<Animal[]>;
}
