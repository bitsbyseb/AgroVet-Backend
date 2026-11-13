import type { Context } from 'hono';
import { RegisterUserUseCase } from '@application/use-cases/Auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '@application/use-cases/Auth/LoginUserUseCase.js';
import type { AuditService } from '@infrastructure/services/AuditService.js';

export class AuthController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private loginUserUseCase: LoginUserUseCase,
        private auditService?: AuditService
    ) {}

    async signup(c: any) {
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
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async login(c: any) {
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
        } catch (error: any) {
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
