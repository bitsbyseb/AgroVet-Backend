import bcrypt from 'bcrypt';
import type { PasswordHasher } from '@domain/services/PasswordHasher.js';

export class BcryptHasher implements PasswordHasher {
    private readonly saltRounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(password, hashed);
    }
}
