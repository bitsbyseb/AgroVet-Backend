import type { Context } from 'hono';
import { RegisterUserUseCase } from '@application/use-cases/Auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '@application/use-cases/Auth/LoginUserUseCase.js';

export class AuthController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private loginUserUseCase: LoginUserUseCase
    ) {}

    async signup(c: Context) {
        const data = await c.req.json(); // Use json() directly as valid('json') depends on Zod validator being applied
        try {
            await this.registerUserUseCase.execute(data);
            return c.json({ message: 'User registered successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async login(c: Context) {
        const data = await c.req.json();
        try {
            const token = await this.loginUserUseCase.execute(data);
            return c.json({ token });
        } catch (error: any) {
            return c.json({ error: error.message }, 401);
        }
    }
}
