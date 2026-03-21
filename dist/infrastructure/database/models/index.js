import { ProductionData } from "./ProductionData.model.js";
import { MedicalHistory } from "./MedicalHistory.model.js";
import { ReproductionData } from "./Reproduction.model.js";
import { Appointment } from "./Appointment.model.js";
import { Vaccination } from "./Vaccination.model.js";
import { sequelize } from "../config/db.config.js";
import { Animal } from "./Animal.model.js";
import { Owner } from "./Owner.model.js";
import { UserSequelizeModel } from "./UserSequelizeModel.js";
import { Alimentation } from "./Alimentation.model.js";
import { Food } from "./Food.model.js";
sequelize.addModels([
    ReproductionData,
    ProductionData,
    MedicalHistory,
    Appointment,
    Vaccination,
    Alimentation,
    Animal,
    Owner,
    UserSequelizeModel,
    Food
]);
Owner.hasMany(Animal, {
    foreignKey: 'ownerId',
    as: 'animals'
});
Animal.belongsTo(Owner, {
    foreignKey: 'ownerId',
    as: 'owner'
});
Animal.hasMany(MedicalHistory, {
    foreignKey: 'animalId',
    as: 'medicalHistories'
});
MedicalHistory.belongsTo(Animal, {
    foreignKey: 'animalId',
    as: 'animal'
});
Animal.hasMany(Alimentation, {
    foreignKey: "animalId",
    as: 'alimentations'
});
Alimentation.belongsTo(Animal, {
    foreignKey: 'animalId',
    as: 'animal'
});
Alimentation.hasOne(Food, {
    foreignKey: 'foodId',
    as: 'food'
});
Food.belongsTo(Alimentation, {
    foreignKey: 'foodId',
    as: 'alimentations'
});
UserSequelizeModel.hasMany(MedicalHistory, { foreignKey: 'createdBy', as: 'writtenHistories' });
MedicalHistory.belongsTo(UserSequelizeModel, { foreignKey: 'createdBy', as: 'veterinarian' });
UserSequelizeModel.hasMany(Vaccination, { foreignKey: 'administeredBy', as: 'appliedVaccines' });
Vaccination.belongsTo(UserSequelizeModel, { foreignKey: 'administeredBy', as: 'provider' });
UserSequelizeModel.hasMany(Appointment, { foreignKey: 'createdBy', as: 'managedAppointments' });
Appointment.belongsTo(UserSequelizeModel, { foreignKey: 'createdBy', as: 'registrar' });
Animal.hasMany(ProductionData, { foreignKey: 'animalId', as: 'productions' });
ProductionData.belongsTo(Animal, { foreignKey: 'animalId', as: 'animal' });
Animal.hasMany(ReproductionData, { foreignKey: 'animalId', as: 'reproductions' });
ReproductionData.belongsTo(Animal, { foreignKey: 'animalId', as: 'animal' });
