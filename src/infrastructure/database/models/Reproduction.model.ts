import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "@sequelize/core";
import { Attribute, Default, NotNull, PrimaryKey, Table, Unique } from "@sequelize/core/decorators-legacy";
import { ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";

@Table({ tableName: 'reproduction', underscored: true })
export class ReproductionData extends Model<InferAttributes<ReproductionData>, InferCreationAttributes<ReproductionData>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Unique
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare animalId: string;

  @Attribute(DataTypes.ENUM(...Object.values(ReproductiveStatus)))
  @NotNull
  declare reproductiveStatus: ReproductiveStatus;

  @Attribute(DataTypes.DATEONLY)
  declare lastCalvingDate: string | null;

  @Attribute(DataTypes.INTEGER)
  @Default(0)
  declare offspringCount: number;

  @Attribute(DataTypes.ENUM(...Object.values(BreedingType)))
  declare breedingType: BreedingType | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}