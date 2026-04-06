import type { Context } from 'hono';
import { RegisterUserUseCase } from '@application/use-cases/Auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '@application/use-cases/Auth/LoginUserUseCase.js';

export class AuthController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private loginUserUseCase: LoginUserUseCase
    ) {}

    async signup(c: any) {
        const data = c.req.valid('json');
        try {
            await this.registerUserUseCase.execute(data);
            return c.json({ message: 'User registered successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async login(c: any) {
        const data = c.req.valid('json');
        try {
            const token = await this.loginUserUseCase.execute(data);
            return c.json({ token });
        } catch (error: any) {
            return c.json({ error: error.message }, 401);
        }
    }
}
