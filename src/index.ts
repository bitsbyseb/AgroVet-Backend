import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sequelize } from '@infrastructure/database/config/db.config.js';
import '@infrastructure/database/models/index.js';
import { User, UserRole } from '@domain/entities/User.js';

// Repositories
import { SequelizeUserRepository } from '@infrastructure/database/repositories/SequelizeUserRepository.js';
import { SequelizeOwnerRepository } from '@infrastructure/database/repositories/SequelizeOwnerRepository.js';
import { SequelizeAnimalRepository } from '@infrastructure/database/repositories/SequelizeAnimalRepository.js';
import { SequelizeAppointmentRepository } from '@infrastructure/database/repositories/SequelizeAppointmentRepository.js';
import { SequelizeMedicalHistoryRepository } from '@infrastructure/database/repositories/SequelizeMedicalHistoryRepository.js';
import { SequelizeVaccinationRepository } from '@infrastructure/database/repositories/SequelizeVaccinationRepository.js';
import { SequelizeFoodRepository } from '@infrastructure/database/repositories/SequelizeFoodRepository.js';
import { SequelizeAlimentationRepository } from '@infrastructure/database/repositories/SequelizeAlimentationRepository.js';
import { SequelizeProductionDataRepository } from '@infrastructure/database/repositories/SequelizeProductionDataRepository.js';
import { SequelizeReproductionRepository } from '@infrastructure/database/repositories/SequelizeReproductionRepository.js';
import { SequelizePaddockRepository } from '@infrastructure/database/repositories/SequelizePaddockRepository.js';

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

// Use Cases - Food & Diet
import { RegisterFoodUseCase } from '@application/use-cases/Food/RegisterFoodUseCase.js';
import { ListFoodsUseCase } from '@application/use-cases/Food/ListFoodsUseCase.js';
import { RegisterAlimentationUseCase } from '@application/use-cases/Alimentation/RegisterAlimentationUseCase.js';
import { GetAnimalDietUseCase } from '@application/use-cases/Alimentation/GetAnimalDietUseCase.js';

// Use Cases - Production & Reproduction
import { RegisterProductionUseCase } from '@application/use-cases/Production/RegisterProductionUseCase.js';
import { GetAnimalProductionUseCase } from '@application/use-cases/Production/GetAnimalProductionUseCase.js';
import { RegisterReproductionUseCase } from '@application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { GetAnimalReproductionUseCase } from '@application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';

// Use Cases - Paddocks
import { RegisterPaddockUseCase } from '@application/use-cases/paddocks/RegisterPaddockUseCase.js';
import { GetPaddocksUseCase } from '@application/use-cases/paddocks/GetPaddocksUseCase.js';
import { UpdatePaddockUseCase } from '@application/use-cases/paddocks/UpdatePaddockUseCase.js';

// Controllers
import { AuthController } from '@infrastructure/http/hono/controllers/AuthController.js';
import { OwnerController } from '@infrastructure/http/hono/controllers/OwnerController.js';
import { AnimalController } from '@infrastructure/http/hono/controllers/AnimalController.js';
import { AppointmentController } from '@infrastructure/http/hono/controllers/AppointmentController.js';
import { MedicalHistoryController } from '@infrastructure/http/hono/controllers/MedicalHistoryController.js';
import { VaccinationController } from '@infrastructure/http/hono/controllers/VaccinationController.js';
import { FoodController } from '@infrastructure/http/hono/controllers/FoodController.js';
import { AlimentationController } from '@infrastructure/http/hono/controllers/AlimentationController.js';
import { ProductionController } from '@infrastructure/http/hono/controllers/ProductionController.js';
import { ReproductionController } from '@infrastructure/http/hono/controllers/ReproductionController.js';
import { PaddockController } from '@infrastructure/http/hono/controllers/PaddockController.js';

// Routers
import { createAuthRouter } from '@infrastructure/http/hono/routers/AuthRouter.js';
import { createOwnerRouter } from '@infrastructure/http/hono/routers/OwnerRouter.js';
import { createAnimalRouter } from '@infrastructure/http/hono/routers/AnimalRouter.js';
import { createAppointmentRouter } from '@infrastructure/http/hono/routers/AppointmentRouter.js';
import { createFoodRouter } from '@infrastructure/http/hono/routers/FoodRouter.js';
import { createPaddockRouter } from '@infrastructure/http/hono/routers/PaddockRouter.js';

import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { randomUUID } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';
import { ResendEmailService } from '@infrastructure/services/ResendEmail.service.js';

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
const foodRepository = new SequelizeFoodRepository();
const alimentationRepository = new SequelizeAlimentationRepository();
const productionRepository = new SequelizeProductionDataRepository();
const reproductionRepository = new SequelizeReproductionRepository();
const paddockRepository = new SequelizePaddockRepository();
const passwordHasher = new BcryptHasher();
const tokenService = new HonoTokenService();

// Services (Email)
const EmailService = new ResendEmailService();

// Use Cases (Auth)
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher,EmailService);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService,EmailService);

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

// Use Cases (Food & Diet)
const registerFoodUseCase = new RegisterFoodUseCase(foodRepository);
const listFoodsUseCase = new ListFoodsUseCase(foodRepository);
const registerAlimentationUseCase = new RegisterAlimentationUseCase(alimentationRepository, animalRepository, foodRepository);
const getAnimalDietUseCase = new GetAnimalDietUseCase(alimentationRepository, animalRepository);

// Use Cases (Production & Reproduction)
const registerProductionUseCase = new RegisterProductionUseCase(productionRepository, animalRepository);
const getAnimalProductionUseCase = new GetAnimalProductionUseCase(productionRepository, animalRepository);
const registerReproductionUseCase = new RegisterReproductionUseCase(reproductionRepository, animalRepository);
const getAnimalReproductionUseCase = new GetAnimalReproductionUseCase(reproductionRepository, animalRepository);

// Use Cases (Paddocks)
const registerPaddockUseCase = new RegisterPaddockUseCase(paddockRepository);
const getPaddocksUseCase = new GetPaddocksUseCase(paddockRepository);
const updatePaddockUseCase = new UpdatePaddockUseCase(paddockRepository);

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
const foodController = new FoodController(registerFoodUseCase, listFoodsUseCase);
const alimentationController = new AlimentationController(registerAlimentationUseCase, getAnimalDietUseCase);
const productionController = new ProductionController(registerProductionUseCase, getAnimalProductionUseCase);
const reproductionController = new ReproductionController(registerReproductionUseCase, getAnimalReproductionUseCase);
const paddockController = new PaddockController(registerPaddockUseCase, getPaddocksUseCase, updatePaddockUseCase);

const animalController = new AnimalController(
    registerAnimalUseCase,
    getAnimalByIdUseCase,
    listAllAnimalsUseCase,
    updateAnimalUseCase,
    deleteAnimalUseCase,
    transferAnimalOwnershipUseCase
);
const appointmentController = new AppointmentController(registerAppointmentUseCase, listAppointmentsUseCase, updateAppointmentUseCase);

// SEEDING
const seedAdmins = async () => {
    const admins = [
        { username: 'Johan Puentes', email: 'jspuentes@ucundinamarca.edu.co' },
        { username: 'Dayana Oliva', email: 'noliva@ucundinamarca.edu.co' }
    ];

    for (const admin of admins) {
        const exists = await userRepository.findByEmail(admin.email);
        if (!exists) {
            const hashedPassword = await passwordHasher.hash('AgroVet2026*');
            const newUser = new User({
                id: randomUUID(),
                username: admin.username,
                email: admin.email,
                password: hashedPassword,
                role: UserRole.ADMIN
            });
            await userRepository.save(newUser);
            console.log(`Admin seeded: ${admin.email}`);
        }
    }
};

await seedAdmins();

// Routers setup
const authRouter = createAuthRouter(authController);
const ownerRouter = createOwnerRouter(ownerController);
const animalRouter = createAnimalRouter(
    animalController,
    medicalHistoryController,
    vaccinationController,
    alimentationController,
    productionController,
    reproductionController
);
const appointmentRouter = createAppointmentRouter(appointmentController);
const foodRouter = createFoodRouter(foodController);
const paddockRouter = createPaddockRouter(paddockController);

const app = new OpenAPIHono();

app.onError((err, c) => {
    console.error({
        name: err.name,
        message: err.message,
        stack: err.stack
    })
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    return c.text('Error interno del servidor', 500)
});

app.use('*', cors());

// Security Scheme Registration
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

// Swagger Documentation
app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        title: 'AgroVet API',
        version: '1.0.0',
        description: 'API for AgroVet Management System',
    }
});

app.get('/ui', swaggerUI({ url: '/doc' }));

// Routes Registration
const v1 = new OpenAPIHono();
v1.route('/auth', authRouter);
v1.route('/owners', ownerRouter);
v1.route('/animals', animalRouter);
v1.route('/appointments', appointmentRouter);
v1.route('/foods', foodRouter);
v1.route('/paddocks', paddockRouter);

app.route('/api/v1', v1);



const server = serve({
    fetch: app.fetch,
    port: PORT,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM: cerrando servidor...');

    server.close(() => {

        console.log('Servidor cerrado.');

        sequelize.close().then(() => {
            process.exit(0);

        });
    });
});