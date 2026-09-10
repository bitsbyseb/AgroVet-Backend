import { sign, verify } from 'hono/jwt';
export class HonoTokenService {
    secret;
    constructor() {
        this.secret = process.env.JWT_SECRET || 'secret';
    }
    async generateToken(payload) {
        const now = Math.floor(Date.now() / 1000);
        const jwtPayload = {
            ...payload,
            iat: now,
            exp: now + 1 * 60 * 60, // 1 hour
        };
        return sign(jwtPayload, this.secret, 'HS256');
    }
    async verifyToken(token) {
        return verify(token, this.secret, 'HS256');
    }
}
