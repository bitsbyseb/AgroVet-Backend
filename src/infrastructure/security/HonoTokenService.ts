import { sign, verify } from 'hono/jwt';
import type { TokenService } from '@domain/services/TokenService.js';

export class HonoTokenService implements TokenService {
    private readonly secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'secret';
    }

    async generateToken(payload: { sub: string, role: string }): Promise<string> {
        const now = Math.floor(Date.now() / 1000);
        const jwtPayload = {
            ...payload,
            iat: now,
            exp: now + 1 * 60 * 60, // 1 hour
        };
        return sign(jwtPayload, this.secret, 'HS256');
    }

    async verifyToken(token: string): Promise<any> {
        return verify(token, this.secret, 'HS256');
    }
}
