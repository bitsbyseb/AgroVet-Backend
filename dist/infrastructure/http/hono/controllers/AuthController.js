import { RegisterUserUseCase } from '../../../../application/use-cases/RegisterUserUseCase.js';
import { LoginUserUseCase } from '../../../../application/use-cases/LoginUserUseCase.js';
export class AuthController {
    registerUserUseCase;
    loginUserUseCase;
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }
    async signup(c) {
        const data = await c.req.json(); // Use json() directly as valid('json') depends on Zod validator being applied
        try {
            await this.registerUserUseCase.execute(data);
            return c.json({ message: 'User registered successfully' }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async login(c) {
        const data = await c.req.json();
        try {
            const token = await this.loginUserUseCase.execute(data);
            return c.json({ token });
        }
        catch (error) {
            return c.json({ error: error.message }, 401);
        }
    }
}
