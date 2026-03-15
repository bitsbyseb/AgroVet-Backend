import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey } from "@sequelize/core/decorators-legacy";

export class Food extends Model<InferAttributes<Food>,InferCreationAttributes<Food>>
{
    @Attribute(DataTypes.UUID)
    @PrimaryKey
    declare food_id:string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name:string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare type:string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare description:string;
}