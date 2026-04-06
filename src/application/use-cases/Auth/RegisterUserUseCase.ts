import { User, UserRole } from '@domain/entities/User.js';
import type { UserRepository } from '@domain/repositories/UserRepository.js';
import type { PasswordHasher } from '@domain/services/PasswordHasher.js';
import { randomUUID } from 'node:crypto';

export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export class RegisterUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher
    ) {}

    async execute(request: RegisterUserRequest): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new Error('User is already in the system');
        }

        const hashedPassword = await this.passwordHasher.hash(request.password);

        if (request.role === UserRole.ADMIN) {
            throw new Error('Unauthorized: Cannot create users with Administrator role');
        }

        const newUser = new User({
            id: randomUUID(),
            username: request.username,
            email: request.email,
            password: hashedPassword,
            role: request.role,
        });

        await this.userRepository.save(newUser);
    }
}
