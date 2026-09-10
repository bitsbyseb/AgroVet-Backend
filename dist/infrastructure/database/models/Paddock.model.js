var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, Default, NotNull, PrimaryKey, Table, Unique } from '@sequelize/core/decorators-legacy';
import { PaddockStatus } from '../../../domain/entities/Paddock.js';
let Paddock = class Paddock extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    Default(DataTypes.UUIDV4),
    NotNull,
    Unique
], Paddock.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull,
    Unique
], Paddock.prototype, "name", void 0);
__decorate([
    Attribute(DataTypes.DECIMAL(10, 2))
], Paddock.prototype, "area", void 0);
__decorate([
    Attribute(DataTypes.INTEGER),
    NotNull
], Paddock.prototype, "capacity", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(PaddockStatus))),
    NotNull,
    Default(PaddockStatus.ACTIVE)
], Paddock.prototype, "status", void 0);
__decorate([
    Attribute(DataTypes.TEXT)
], Paddock.prototype, "description", void 0);
Paddock = __decorate([
    Table({
        tableName: 'paddocks',
        underscored: true
    })
], Paddock);
export { Paddock };
