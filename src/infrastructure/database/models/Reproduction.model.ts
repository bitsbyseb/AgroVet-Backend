import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "@sequelize/core";
import { Attribute, Default, NotNull, PrimaryKey, Table, Unique } from "@sequelize/core/decorators-legacy";
import { ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";

@Table({ tableName: 'reproduction', underscored: true })
export class ReproductionData extends Model<InferAttributes<ReproductionData>, InferCreationAttributes<ReproductionData>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
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

  @Attribute(DataTypes.DATE)
  declare heatDate: Date | null;

  @Attribute(DataTypes.DATE)
  declare expectedCalvingDate: Date | null;

  @Attribute(DataTypes.STRING(100))
  declare bullId: string | null;

  @Attribute(DataTypes.STRING(100))
  declare semenBatch: string | null;

  @Attribute(DataTypes.TEXT)
  declare inseminationDetails: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
