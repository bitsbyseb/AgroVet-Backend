var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey, Unique, Default } from "@sequelize/core/decorators-legacy";
export class MedicalHistory extends Model {
}
__decorate([
    Attribute(DataTypes.UUID),
    Unique,
    NotNull,
    PrimaryKey
], MedicalHistory.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], MedicalHistory.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    Default(DataTypes.NOW),
    NotNull
], MedicalHistory.prototype, "date", void 0);
__decorate([
    Attribute(DataTypes.TEXT),
    NotNull
], MedicalHistory.prototype, "reason", void 0);
__decorate([
    Attribute(DataTypes.TEXT),
    NotNull
], MedicalHistory.prototype, "diagnosis", void 0);
__decorate([
    Attribute(DataTypes.TEXT),
    NotNull
], MedicalHistory.prototype, "treatment", void 0);
__decorate([
    Attribute(DataTypes.TEXT),
    NotNull
], MedicalHistory.prototype, "observations", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], MedicalHistory.prototype, "createdBy", void 0);
