var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, PrimaryKey, Table, Default, NotNull } from '@sequelize/core/decorators-legacy';
let Alert = class Alert extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    NotNull
], Alert.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Alert.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Alert.prototype, "userId", void 0);
__decorate([
    Attribute(DataTypes.ENUM('vaccination', 'treatment', 'control', 'feeding', 'reproduction', 'production', 'grazing')),
    NotNull
], Alert.prototype, "moduleType", void 0);
__decorate([
    Attribute(DataTypes.TEXT),
    NotNull
], Alert.prototype, "message", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    NotNull
], Alert.prototype, "triggerDate", void 0);
__decorate([
    Attribute(DataTypes.ENUM('pending', 'read')),
    Default('pending'),
    NotNull
], Alert.prototype, "status", void 0);
__decorate([
    Attribute(DataTypes.ENUM('low', 'medium', 'high')),
    Default('medium'),
    NotNull
], Alert.prototype, "priority", void 0);
__decorate([
    Attribute(DataTypes.BOOLEAN),
    Default(false),
    NotNull
], Alert.prototype, "emailSent", void 0);
Alert = __decorate([
    Table({ tableName: 'alerts', underscored: true })
], Alert);
export { Alert };
