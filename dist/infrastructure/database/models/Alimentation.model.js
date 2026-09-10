var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from "@sequelize/core";
import { Table, PrimaryKey, Attribute, NotNull } from "@sequelize/core/decorators-legacy";
import { weightUnits, frequency } from "../../../domain/entities/Alimentation.js";
let Alimentation = class Alimentation extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    NotNull
], Alimentation.prototype, "alimentationId", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Alimentation.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Alimentation.prototype, "foodId", void 0);
__decorate([
    Attribute(DataTypes.INTEGER)
], Alimentation.prototype, "count", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(weightUnits)))
], Alimentation.prototype, "unit", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(frequency)))
], Alimentation.prototype, "frequency", void 0);
__decorate([
    Attribute(DataTypes.DATE)
], Alimentation.prototype, "start_date", void 0);
__decorate([
    Attribute(DataTypes.DATE)
], Alimentation.prototype, "end_date", void 0);
__decorate([
    Attribute(DataTypes.TEXT)
], Alimentation.prototype, "observations", void 0);
Alimentation = __decorate([
    Table({
        tableName: "alimentation",
    })
], Alimentation);
export { Alimentation };
