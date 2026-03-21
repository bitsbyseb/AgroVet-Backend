var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey, Unique } from "@sequelize/core/decorators-legacy";
var OwnerType;
(function (OwnerType) {
    OwnerType["URBAN"] = "urban";
    OwnerType["RURAL"] = "rural";
})(OwnerType || (OwnerType = {}));
export class Owner extends Model {
}
__decorate([
    Attribute(DataTypes.UUID),
    NotNull,
    Unique,
    PrimaryKey
], Owner.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull
], Owner.prototype, "name", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull,
    Unique
], Owner.prototype, "document", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull
], Owner.prototype, "phone", void 0);
__decorate([
    Attribute(DataTypes.STRING),
    NotNull
], Owner.prototype, "email", void 0);
__decorate([
    Attribute(DataTypes.TEXT),
    NotNull
], Owner.prototype, "address", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(OwnerType))),
    NotNull
], Owner.prototype, "ownerType", void 0);
