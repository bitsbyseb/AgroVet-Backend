var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from "@sequelize/core";
import { Attribute, PrimaryKey, NotNull, Unique, Table, Default } from '@sequelize/core/decorators-legacy';
var animalType;
(function (animalType) {
    animalType["URBAN"] = "urban";
    animalType["RURAL"] = "rural";
})(animalType || (animalType = {}));
var speciesType;
(function (speciesType) {
    speciesType["CANINE"] = "canine";
    speciesType["FELINE"] = "feline";
    speciesType["BOVINE"] = "bovine";
    speciesType["CAPRINE"] = "caprine";
    speciesType["EQUINE"] = "equine";
    speciesType["POULTRY"] = "poultry";
    speciesType["PIG"] = "pig";
})(speciesType || (speciesType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (Gender = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["INACTIVE"] = "inactive";
})(Status || (Status = {}));
let Animal = class Animal extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    Unique,
    NotNull,
    PrimaryKey
], Animal.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull
], Animal.prototype, "name", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(speciesType))),
    NotNull
], Animal.prototype, "species", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(animalType))),
    NotNull
], Animal.prototype, "animalType", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull
], Animal.prototype, "breed", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(Gender))),
    NotNull
], Animal.prototype, "gender", void 0);
__decorate([
    Attribute(DataTypes.DATEONLY),
    NotNull
], Animal.prototype, "birthDate", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull
], Animal.prototype, "color", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(Status))),
    NotNull,
    Default(Status.ACTIVE)
], Animal.prototype, "status", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Animal.prototype, "ownerId", void 0);
__decorate([
    Attribute(DataTypes.UUID)
], Animal.prototype, "paddockId", void 0);
Animal = __decorate([
    Table({
        tableName: "animals"
    })
], Animal);
export { Animal };
