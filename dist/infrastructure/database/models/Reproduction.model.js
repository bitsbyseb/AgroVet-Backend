var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from "@sequelize/core";
import { Attribute, Default, NotNull, PrimaryKey, Table, Unique } from "@sequelize/core/decorators-legacy";
import { ReproductiveStatus, BreedingType } from "../../../domain/entities/Reproduction.js";
let ReproductionData = class ReproductionData extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    Unique
], ReproductionData.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], ReproductionData.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(ReproductiveStatus))),
    NotNull
], ReproductionData.prototype, "reproductiveStatus", void 0);
__decorate([
    Attribute(DataTypes.DATEONLY)
], ReproductionData.prototype, "lastCalvingDate", void 0);
__decorate([
    Attribute(DataTypes.INTEGER),
    Default(0)
], ReproductionData.prototype, "offspringCount", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(BreedingType)))
], ReproductionData.prototype, "breedingType", void 0);
ReproductionData = __decorate([
    Table({ tableName: 'reproduction', underscored: true })
], ReproductionData);
export { ReproductionData };
