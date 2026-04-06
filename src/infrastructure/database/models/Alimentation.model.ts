import { DataTypes, Model } from "@sequelize/core";
import {
    Table,
    PrimaryKey,
    Attribute,
    NotNull
} from "@sequelize/core/decorators-legacy";

import { weightUnits, frequency } from "@domain/entities/Alimentation.js";

@Table({
    tableName: "alimentation",
})
export class Alimentation extends Model {
    @Attribute(DataTypes.UUID)
    @PrimaryKey
    @NotNull
    declare alimentationId: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare animalId: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare foodId: string;

    @Attribute(DataTypes.INTEGER)
    declare count: number;

    @Attribute(DataTypes.ENUM(...Object.values(weightUnits)))
    declare unit: weightUnits;

    @Attribute(DataTypes.ENUM(...Object.values(frequency)))
    declare frequency: frequency;

    @Attribute(DataTypes.DATE)
    declare start_date: Date;

    @Attribute(DataTypes.DATE)
    declare end_date: Date;

    @Attribute(DataTypes.TEXT)
    declare observations: string;
}