var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Model, DataTypes } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, Default, NotNull, Unique } from "@sequelize/core/decorators-legacy";
let AuditLog = class AuditLog extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    NotNull,
    Unique
], AuditLog.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID)
], AuditLog.prototype, "userId", void 0);
__decorate([
    Attribute(DataTypes.STRING(255))
], AuditLog.prototype, "userEmail", void 0);
__decorate([
    Attribute(DataTypes.STRING(50))
], AuditLog.prototype, "userRole", void 0);
__decorate([
    Attribute(DataTypes.STRING(50)),
    NotNull
], AuditLog.prototype, "action", void 0);
__decorate([
    Attribute(DataTypes.STRING(100)),
    NotNull
], AuditLog.prototype, "resource", void 0);
__decorate([
    Attribute(DataTypes.STRING(255))
], AuditLog.prototype, "resourceId", void 0);
__decorate([
    Attribute(DataTypes.TEXT)
], AuditLog.prototype, "details", void 0);
__decorate([
    Attribute(DataTypes.STRING(100))
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    Attribute(DataTypes.STRING(20)),
    NotNull,
    Default('SUCCESS')
], AuditLog.prototype, "status", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    Default(DataTypes.NOW)
], AuditLog.prototype, "createdAt", void 0);
AuditLog = __decorate([
    Table({ tableName: 'audit_logs', underscored: true })
], AuditLog);
export { AuditLog };
