import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey, Unique, Default } from "@sequelize/core/decorators-legacy";
import type { PhysiologicalConstants } from "@domain/entities/MedicalHistory.js";

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

    @Attribute(DataTypes.TEXT)
    declare evolution: CreationOptional<string | null>;

    @Attribute(DataTypes.JSON)
    declare physiologicalConstants: CreationOptional<PhysiologicalConstants | null>;

    @Attribute(DataTypes.DECIMAL(10, 2))
    declare weight: CreationOptional<number | null>;

    @Attribute(DataTypes.DECIMAL(3, 1))
    declare bodyConditionScore: CreationOptional<number | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}
