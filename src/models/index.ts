import { ProductionData } from "./ProductionData.model.js";
import { MedicalHistory } from "./MedicalHistory.model.js";
import { ReproductionData } from "./Reproduction.model.js";
import { Appointment } from "./Appointment.model.js";
import { Vaccination } from "./Vaccination.model.js";
import { sequelize } from "../config/db.config.js";
import { Animal } from "./Animal.model.js";
import { Owner } from "./Owner.model.js";
import { User } from "./User.model.js";
import { Alimentation } from "./Alimentation.model.js";
import { Food } from "./Food.model.js";

sequelize.addModels([
    ReproductionData,
    ProductionData,
    MedicalHistory,
    Appointment,
    Vaccination,
    Animal,
    Owner,
    User])

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


Animal.hasMany(Alimentation,{
    foreignKey:"animalId",
    as:'alimentations'
});

Alimentation.belongsTo(Animal,{
    foreignKey:'animalId',
    as:'animal'
});


Alimentation.hasOne(Food,{
    foreignKey:'food_id',
    as:'food'
});

Food.belongsTo(Alimentation,{
    foreignKey:'food_id',
    as:'alimentations'
})


User.hasMany(MedicalHistory, { foreignKey: 'createdBy', as: 'writtenHistories' });
MedicalHistory.belongsTo(User, { foreignKey: 'createdBy', as: 'veterinarian' });

User.hasMany(Vaccination, { foreignKey: 'administeredBy', as: 'appliedVaccines' });
Vaccination.belongsTo(User, { foreignKey: 'administeredBy', as: 'provider' });

User.hasMany(Appointment, { foreignKey: 'createdBy', as: 'managedAppointments' });
Appointment.belongsTo(User, { foreignKey: 'createdBy', as: 'registrar' });


Animal.hasMany(ProductionData, { foreignKey: 'animalId', as: 'productions' });
ProductionData.belongsTo(Animal, { foreignKey: 'animalId', as: 'animal' });

Animal.hasMany(ReproductionData, { foreignKey: 'animalId', as: 'reproductions' });
ReproductionData.belongsTo(Animal, { foreignKey: 'animalId', as: 'animal' });
