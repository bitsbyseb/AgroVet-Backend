import { Hono } from 'hono';
import { AuthController } from '../controllers/AuthController.js';
import { signupValidator } from '../validators/SignupValidator.js';

export function createAuthRouter(authController: AuthController) {
    const router = new Hono();

    router.post('/signup', signupValidator, (c) => authController.signup(c));
    router.post('/login', (c) => authController.login(c));

    return router;
}
