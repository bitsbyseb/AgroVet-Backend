import bcrypt from 'bcrypt';
export class BcryptHasher {
    saltRounds = 10;
    async hash(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async compare(password, hashed) {
        return bcrypt.compare(password, hashed);
    }
}
