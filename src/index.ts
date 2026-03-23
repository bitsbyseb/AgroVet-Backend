import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sequelize } from '@infrastructure/database/config/db.config.js';
import '@infrastructure/database/models/index.js';

// Repositories
import { SequelizeUserRepository } from '@infrastructure/database/repositories/SequelizeUserRepository.js';
import { SequelizeOwnerRepository } from '@infrastructure/database/repositories/SequelizeOwnerRepository.js';
import { SequelizeAnimalRepository } from '@infrastructure/database/repositories/SequelizeAnimalRepository.js';

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

// Controllers
import { AuthController } from '@infrastructure/http/hono/controllers/AuthController.js';
import { OwnerController } from '@infrastructure/http/hono/controllers/OwnerController.js';
import { AnimalController } from '@infrastructure/http/hono/controllers/AnimalController.js';

// Routers
import { createAuthRouter } from '@infrastructure/http/hono/routers/AuthRouter.js';
import { createOwnerRouter } from '@infrastructure/http/hono/routers/OwnerRouter.js';
import { createAnimalRouter } from '@infrastructure/http/hono/routers/AnimalRouter.js';

await sequelize.authenticate();
await sequelize.sync();

const PORT = parseInt(process.env.PORT || '3000');

// Dependency Injection - Infrastructure
const userRepository = new SequelizeUserRepository();
const ownerRepository = new SequelizeOwnerRepository();
const animalRepository = new SequelizeAnimalRepository();
const passwordHasher = new BcryptHasher();
const tokenService = new HonoTokenService();

// Dependency Injection - Use Cases (Auth)
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);

// Dependency Injection - Use Cases (Owner)
const registerOwnerUseCase = new RegisterOwnerUseCase(ownerRepository);
const updateOwnerProfileUseCase = new UpdateOwnerProfileUseCase(ownerRepository);
const getOwnerByIdUseCase = new GetOwnerByIdUseCase(ownerRepository);
const listAllOwnersUseCase = new ListAllOwnersUseCase(ownerRepository);
const deleteOwnerUseCase = new DeleteOwnerUseCase(ownerRepository);

// Dependency Injection - Use Cases (Animal)
const registerAnimalUseCase = new RegisterAnimalUseCase(animalRepository, ownerRepository);
const getAnimalByIdUseCase = new GetAnimalByIdUseCase(animalRepository);
const listAllAnimalsUseCase = new ListAllAnimalsUseCase(animalRepository);
const updateAnimalUseCase = new UpdateAnimalUseCase(animalRepository);
const deleteAnimalUseCase = new DeleteAnimalUseCase(animalRepository);
const getOwnerAnimalsUseCase = new GetOwnerAnimalsUseCase(animalRepository, ownerRepository);
const transferAnimalOwnershipUseCase = new TransferAnimalOwnershipUseCase(animalRepository, ownerRepository);

// Dependency Injection - Controllers
const authController = new AuthController(registerUserUseCase, loginUserUseCase);
const ownerController = new OwnerController(
    registerOwnerUseCase,
    updateOwnerProfileUseCase,
    getOwnerByIdUseCase,
    listAllOwnersUseCase,
    deleteOwnerUseCase,
    getOwnerAnimalsUseCase
);
const animalController = new AnimalController(
    registerAnimalUseCase,
    getAnimalByIdUseCase,
    listAllAnimalsUseCase,
    updateAnimalUseCase,
    deleteAnimalUseCase,
    transferAnimalOwnershipUseCase
);

// Routers setup
const authRouter = createAuthRouter(authController);
const ownerRouter = createOwnerRouter(ownerController);
const animalRouter = createAnimalRouter(animalController);

const app = new Hono();

// Routes Registration
app.route('/api/auth', authRouter);
app.route('/api/owners', ownerRouter);
app.route('/api/animals', animalRouter);

serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
