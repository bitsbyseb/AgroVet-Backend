var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Model, DataTypes } from "@sequelize/core";
import { Attribute, Table, PrimaryKey, Default, NotNull, Unique } from "@sequelize/core/decorators-legacy";
export var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "scheduled";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELLED"] = "cancelled";
})(AppointmentStatus || (AppointmentStatus = {}));
let Appointment = class Appointment extends Model {
};
__decorate([
    Attribute(DataTypes.UUID),
    PrimaryKey,
    NotNull,
    Unique
], Appointment.prototype, "id", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Appointment.prototype, "animalId", void 0);
__decorate([
    Attribute(DataTypes.DATE),
    NotNull
], Appointment.prototype, "date", void 0);
__decorate([
    Attribute(DataTypes.STRING(255)),
    NotNull
], Appointment.prototype, "reason", void 0);
__decorate([
    Attribute(DataTypes.ENUM(...Object.values(AppointmentStatus))),
    Default(AppointmentStatus.SCHEDULED)
], Appointment.prototype, "status", void 0);
__decorate([
    Attribute(DataTypes.UUID),
    NotNull
], Appointment.prototype, "createdBy", void 0);
Appointment = __decorate([
    Table({ tableName: 'appointments', underscored: true })
], Appointment);
export { Appointment };
