var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Model, DataTypes } from "@sequelize/core";
import { Table, Attribute, PrimaryKey, Default, NotNull, Unique } from "@sequelize/core/decorators-legacy";
import { ProductionPurpose } from "../../../domain/entities/ProductionData.js";
let ProductionData = class ProductionData extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    NotNull,
    Unique
], ProductionData.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], ProductionData.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.DECIMAL(10, 2))
], ProductionData.prototype, "weight", void 0);
__decorate([
    Attribute(DataTypes.DECIMAL(10, 2))
], ProductionData.prototype, "milkProduction", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(ProductionPurpose))),
    NotNull
], ProductionData.prototype, "purpose", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    Default(DataTypes.NOW)
], ProductionData.prototype, "recordDate", void 0);
ProductionData = __decorate([
    Table({ tableName: 'production_data', underscored: true })
], ProductionData);
export { ProductionData };
