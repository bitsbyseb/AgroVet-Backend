import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sequelize } from './infrastructure/database/config/db.config.js';
import './infrastructure/database/models/index.js';
import { SequelizeUserRepository } from './infrastructure/database/repositories/SequelizeUserRepository.js';
import { BcryptHasher } from './infrastructure/security/BcryptHasher.js';
import { HonoTokenService } from './infrastructure/security/HonoTokenService.js';
import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase.js';
import { LoginUserUseCase } from './application/use-cases/LoginUserUseCase.js';
import { AuthController } from './infrastructure/http/hono/controllers/AuthController.js';
import { createAuthRouter } from './infrastructure/http/hono/routers/AuthRouter.js';
await sequelize.authenticate();
await sequelize.sync();
const PORT = parseInt(process.env.PORT || '3000');
// Dependency Injection
const userRepository = new SequelizeUserRepository();
const passwordHasher = new BcryptHasher();
const tokenService = new HonoTokenService();
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
const authController = new AuthController(registerUserUseCase, loginUserUseCase);
const authRouter = createAuthRouter(authController);
const app = new Hono();
app.route('/api/auth', authRouter);
serve({
    fetch: app.fetch,
    port: PORT,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
