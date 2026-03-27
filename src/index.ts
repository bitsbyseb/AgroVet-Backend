import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sequelize } from '@infrastructure/database/config/db.config.js';
import '@infrastructure/database/models/index.js';

// Repositories
import { SequelizeUserRepository } from '@infrastructure/database/repositories/SequelizeUserRepository.js';
import { SequelizeOwnerRepository } from '@infrastructure/database/repositories/SequelizeOwnerRepository.js';
import { SequelizeAnimalRepository } from '@infrastructure/database/repositories/SequelizeAnimalRepository.js';
import { SequelizeAppointmentRepository } from '@infrastructure/database/repositories/SequelizeAppointmentRepository.js';
import { SequelizeMedicalHistoryRepository } from '@infrastructure/database/repositories/SequelizeMedicalHistoryRepository.js';
import { SequelizeVaccinationRepository } from '@infrastructure/database/repositories/SequelizeVaccinationRepository.js';

// Security
import { BcryptHasher } from '@infrastructure/security/BcryptHasher.js';
import { HonoTokenService } from '@infrastructure/security/HonoTokenService.js';

// Use Cases - Auth
import { RegisterUserUseCase } from '@application/use-cases/Auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '@application/use-cases/Auth/LoginUserUseCase.js';

// Use Cases - Owner
import { RegisterOwnerUseCase } from '@application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '@application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '@application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '@application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '@application/use-cases/Owner/DeleteOwnerUseCase.js';

// Use Cases - Animal
import { RegisterAnimalUseCase } from '@application/use-cases/Animal/RegisterAnimalUseCase.js';
import { GetAnimalByIdUseCase } from '@application/use-cases/Animal/GetAnimalByIdUseCase.js';
import { ListAllAnimalsUseCase } from '@application/use-cases/Animal/ListAllAnimalsUseCase.js';
import { UpdateAnimalUseCase } from '@application/use-cases/Animal/UpdateAnimalUseCase.js';
import { DeleteAnimalUseCase } from '@application/use-cases/Animal/DeleteAnimalUseCase.js';
import { GetOwnerAnimalsUseCase } from '@application/use-cases/Animal/GetOwnerAnimalsUseCase.js';
import { TransferAnimalOwnershipUseCase } from '@application/use-cases/Animal/TransferAnimalOwnershipUseCase.js';

// Use Cases - Clinical
import { RegisterAppointmentUseCase } from '@application/use-cases/Appointment/RegisterAppointmentUseCase.js';
import { ListAppointmentsUseCase } from '@application/use-cases/Appointment/ListAppointmentsUseCase.js';
import { UpdateAppointmentUseCase } from '@application/use-cases/Appointment/UpdateAppointmentUseCase.js';
import { RegisterMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/RegisterMedicalHistoryUseCase.js';
import { ListMedicalHistoriesUseCase } from '@application/use-cases/MedicalHistory/ListMedicalHistoriesUseCase.js';
import { RegisterVaccinationUseCase } from '@application/use-cases/Vaccination/RegisterVaccinationUseCase.js';
import { ListVaccinationsUseCase } from '@application/use-cases/Vaccination/ListVaccinationsUseCase.js';

// Controllers
import { AuthController } from '@infrastructure/http/hono/controllers/AuthController.js';
import { OwnerController } from '@infrastructure/http/hono/controllers/OwnerController.js';
import { AnimalController } from '@infrastructure/http/hono/controllers/AnimalController.js';
import { AppointmentController } from '@infrastructure/http/hono/controllers/AppointmentController.js';
import { MedicalHistoryController } from '@infrastructure/http/hono/controllers/MedicalHistoryController.js';
import { VaccinationController } from '@infrastructure/http/hono/controllers/VaccinationController.js';

// Routers
import { createAuthRouter } from '@infrastructure/http/hono/routers/AuthRouter.js';
import { createOwnerRouter } from '@infrastructure/http/hono/routers/OwnerRouter.js';
import { createAnimalRouter } from '@infrastructure/http/hono/routers/AnimalRouter.js';
import { createAppointmentRouter } from '@infrastructure/http/hono/routers/AppointmentRouter.js';

await sequelize.authenticate();
await sequelize.sync();

const PORT = parseInt(process.env.PORT || '3000');

// Dependency Injection - Infrastructure
const userRepository = new SequelizeUserRepository();
const ownerRepository = new SequelizeOwnerRepository();
const animalRepository = new SequelizeAnimalRepository();
const appointmentRepository = new SequelizeAppointmentRepository();
const medicalHistoryRepository = new SequelizeMedicalHistoryRepository();
const vaccinationRepository = new SequelizeVaccinationRepository();
const passwordHasher = new BcryptHasher();
const tokenService = new HonoTokenService();

// Use Cases (Auth)
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

// Use Cases (Owner)
const registerOwnerUseCase = new RegisterOwnerUseCase(ownerRepository);
const updateOwnerProfileUseCase = new UpdateOwnerProfileUseCase(ownerRepository);
const getOwnerByIdUseCase = new GetOwnerByIdUseCase(ownerRepository);
const listAllOwnersUseCase = new ListAllOwnersUseCase(ownerRepository);
const deleteOwnerUseCase = new DeleteOwnerUseCase(ownerRepository);

// Use Cases (Animal)
const registerAnimalUseCase = new RegisterAnimalUseCase(animalRepository, ownerRepository);
const getAnimalByIdUseCase = new GetAnimalByIdUseCase(animalRepository);
const listAllAnimalsUseCase = new ListAllAnimalsUseCase(animalRepository);
const updateAnimalUseCase = new UpdateAnimalUseCase(animalRepository);
const deleteAnimalUseCase = new DeleteAnimalUseCase(animalRepository);
const getOwnerAnimalsUseCase = new GetOwnerAnimalsUseCase(animalRepository, ownerRepository);
const transferAnimalOwnershipUseCase = new TransferAnimalOwnershipUseCase(animalRepository, ownerRepository);

// Use Cases (Clinical)
const registerAppointmentUseCase = new RegisterAppointmentUseCase(appointmentRepository, animalRepository);
const listAppointmentsUseCase = new ListAppointmentsUseCase(appointmentRepository);
const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);
const registerMedicalHistoryUseCase = new RegisterMedicalHistoryUseCase(medicalHistoryRepository, animalRepository);
const listMedicalHistoriesUseCase = new ListMedicalHistoriesUseCase(medicalHistoryRepository);
const registerVaccinationUseCase = new RegisterVaccinationUseCase(vaccinationRepository, animalRepository);
const listVaccinationsUseCase = new ListVaccinationsUseCase(vaccinationRepository);

// Controllers
const authController = new AuthController(registerUserUseCase, loginUserUseCase);
const ownerController = new OwnerController(
    registerOwnerUseCase,
    updateOwnerProfileUseCase,
    getOwnerByIdUseCase,
    listAllOwnersUseCase,
    deleteOwnerUseCase,
    getOwnerAnimalsUseCase
);
const medicalHistoryController = new MedicalHistoryController(registerMedicalHistoryUseCase, listMedicalHistoriesUseCase);
const vaccinationController = new VaccinationController(registerVaccinationUseCase, listVaccinationsUseCase);
const animalController = new AnimalController(
    registerAnimalUseCase,
    getAnimalByIdUseCase,
    listAllAnimalsUseCase,
    updateAnimalUseCase,
    deleteAnimalUseCase,
    transferAnimalOwnershipUseCase
);
const appointmentController = new AppointmentController(registerAppointmentUseCase, listAppointmentsUseCase, updateAppointmentUseCase);

// Routers setup
const authRouter = createAuthRouter(authController);
const ownerRouter = createOwnerRouter(ownerController);
const animalRouter = createAnimalRouter(animalController, medicalHistoryController, vaccinationController);
const appointmentRouter = createAppointmentRouter(appointmentController);

const app = new Hono();

// Routes Registration
const v1 = new Hono();
v1.route('/auth', authRouter);
v1.route('/owners', ownerRouter);
v1.route('/animals', animalRouter);
v1.route('/appointments', appointmentRouter);

app.route('/api/v1', v1);

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
