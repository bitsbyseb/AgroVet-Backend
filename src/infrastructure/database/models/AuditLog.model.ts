import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, Default, NotNull, Unique } from "@sequelize/core/decorators-legacy";

@Table({ tableName: 'audit_logs', underscored: true })
export class AuditLog extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  @Unique
  declare id: string;

  @Attribute(DataTypes.UUID)
  declare userId: string | null;

  @Attribute(DataTypes.STRING(255))
  declare userEmail: string | null;

  @Attribute(DataTypes.STRING(50))
  declare userRole: string | null;

  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare action: string;

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare resource: string;

  @Attribute(DataTypes.STRING(255))
  declare resourceId: string | null;

  @Attribute(DataTypes.TEXT)
  declare details: string | null;

  @Attribute(DataTypes.STRING(100))
  declare ipAddress: string | null;

  @Attribute(DataTypes.STRING(20))
  @NotNull
  @Default('SUCCESS')
  declare status: string;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}
