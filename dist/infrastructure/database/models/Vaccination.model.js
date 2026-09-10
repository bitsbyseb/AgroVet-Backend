var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, PrimaryKey, Table, Default, NotNull } from '@sequelize/core/decorators-legacy';
let Vaccination = class Vaccination extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    NotNull
], Vaccination.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Vaccination.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.STRING(100)),
    NotNull
], Vaccination.prototype, "vaccineName", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    NotNull
], Vaccination.prototype, "applicationDate", void 0);
__decorate([
    Attribute(DataTypes.DATE)
], Vaccination.prototype, "nextDoseDate", void 0);
__decorate([
    Attribute(DataTypes.STRING(50))
], Vaccination.prototype, "batchNumber", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Vaccination.prototype, "administeredBy", void 0);
Vaccination = __decorate([
    Table({ tableName: 'vaccinations', underscored: true })
], Vaccination);
export { Vaccination };
