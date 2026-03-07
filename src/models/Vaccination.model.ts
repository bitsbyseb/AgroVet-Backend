import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, Table, Default, NotNull } from '@sequelize/core/decorators-legacy';

@Table({ tableName: 'vaccinations', underscored: true })
export class Vaccination extends Model<InferAttributes<Vaccination>, InferCreationAttributes<Vaccination>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare animalId: string;

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare vaccineName: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare applicationDate: Date;

  @Attribute(DataTypes.DATE)
  declare nextDoseDate: Date | null;

  @Attribute(DataTypes.STRING(50))
  declare batchNumber: string | null;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare administeredBy: string; // FK to User

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}