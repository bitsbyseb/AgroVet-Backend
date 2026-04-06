import { Model,DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "@sequelize/core";
import { Table, Attribute,PrimaryKey,Default,NotNull, Unique } from "@sequelize/core/decorators-legacy";
import { ProductionPurpose } from "@domain/entities/ProductionData.js";

@Table({ tableName: 'production_data', underscored: true })
export class ProductionData extends Model<InferAttributes<ProductionData>, InferCreationAttributes<ProductionData>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  @Unique
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare animalId: string;

  @Attribute(DataTypes.DECIMAL(10, 2))
  declare weight: number | null;

  @Attribute(DataTypes.DECIMAL(10, 2))
  declare milkProduction: number | null; // Litros por día

  @Attribute(DataTypes.ENUM(...Object.values(ProductionPurpose)))
  @NotNull
  declare purpose: ProductionPurpose;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare recordDate: Date;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}