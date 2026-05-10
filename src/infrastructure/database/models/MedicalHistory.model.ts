import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey, Unique, Default } from "@sequelize/core/decorators-legacy";

export class MedicalHistory extends Model<InferAttributes<MedicalHistory>, InferCreationAttributes<MedicalHistory>> {
    @Attribute(DataTypes.UUID)
    @Unique
    @NotNull
    @PrimaryKey
    declare id: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare animalId: string;

    @Attribute(DataTypes.DATE)
    @Default(DataTypes.NOW)
    @NotNull
    declare date: Date;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare reason: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare diagnosis: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare treatment: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare observations: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare createdBy: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}