var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataTypes, Model } from '@sequelize/core';
import { Attribute, Default, NotNull, PrimaryKey, Table, Unique } from '@sequelize/core/decorators-legacy';
let GrazingActivity = class GrazingActivity extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    Default(DataTypes.UUIDV4),
    NotNull,
    Unique
], GrazingActivity.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], GrazingActivity.prototype, "paddockId", void 0);
__decorate([
    Attribute(DataTypes.JSON),
    NotNull,
    Default([])
], GrazingActivity.prototype, "animalIds", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    NotNull
], GrazingActivity.prototype, "entryDate", void 0);
__decorate([
    Attribute(DataTypes.DATE)
], GrazingActivity.prototype, "exitDate", void 0);
__decorate([
    Attribute(DataTypes.INTEGER),
    NotNull
], GrazingActivity.prototype, "rotationNumber", void 0);
__decorate([
    Attribute(DataTypes.TEXT)
], GrazingActivity.prototype, "observations", void 0);
GrazingActivity = __decorate([
    Table({
        tableName: 'grazing_activities',
        underscored: true
    })
], GrazingActivity);
export { GrazingActivity };
