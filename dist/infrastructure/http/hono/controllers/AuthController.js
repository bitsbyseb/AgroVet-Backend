import { RegisterUserUseCase } from '../../../../application/use-cases/Auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '../../../../application/use-cases/Auth/LoginUserUseCase.js';
export class AuthController {
    registerUserUseCase;
    loginUserUseCase;
    auditService;
    constructor(registerUserUseCase, loginUserUseCase, auditService) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.auditService = auditService;
    }
    async signup(c) {
        const data = c.req.valid('json');
        try {
            await this.registerUserUseCase.execute(data);
            this.auditService?.logActivity({
                userEmail: data.email,
                action: 'CREATE',
                resource: 'USER',
                status: 'SUCCESS',
                details: { username: data.username, role: data.role }
            });
            return c.json({ message: 'User registered successfully' }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async login(c) {
        const data = c.req.valid('json');
        const ip = c.req.header('x-forwarded-for')?.split(',')[0].trim() || c.req.header('x-real-ip') || null;
        try {
            const token = await this.loginUserUseCase.execute(data);
            this.auditService?.logActivity({
                userEmail: data.email,
                action: 'LOGIN',
                resource: 'AUTH',
                status: 'SUCCESS',
                ipAddress: ip,
                details: 'Inicio de sesión exitoso'
            });
            return c.json({ token });
        }
        catch (error) {
            this.auditService?.logActivity({
                userEmail: data.email,
                action: 'LOGIN',
                resource: 'AUTH',
                status: 'FAILURE',
                ipAddress: ip,
                details: error.message
            });
            return c.json({ error: error.message }, 401);
        }
    }
}
