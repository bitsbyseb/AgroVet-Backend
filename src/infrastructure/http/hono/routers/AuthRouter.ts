import { Hono } from 'hono';
import { AuthController } from '../controllers/AuthController.js';
import { signupValidator } from '../validators/SignupValidator.js';
import { loginValidator } from '../validators/LoginValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';

export function createAuthRouter(authController: AuthController) {
    const router = new Hono();

    router.post('/login', loginValidator, (c) => authController.login(c));

    // Signup is restricted to administrators
    router.post('/signup', authMiddleware, rbacMiddleware('usuarios'), signupValidator, (c) => authController.signup(c));

    return router;
}
