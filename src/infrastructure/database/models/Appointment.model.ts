import { Model,DataTypes, type CreationOptional,type InferAttributes,type InferCreationAttributes } from "@sequelize/core";
import { Attribute, Table,PrimaryKey,Default,NotNull, Unique } from "@sequelize/core/decorators-legacy";

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Table({ tableName: 'appointments', underscored: true })
export class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  @Unique
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare animalId: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare date: Date;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare reason: string;

  @Attribute(DataTypes.ENUM(...Object.values(AppointmentStatus)))
  @Default(AppointmentStatus.SCHEDULED)
  declare status: AppointmentStatus;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare createdBy: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}