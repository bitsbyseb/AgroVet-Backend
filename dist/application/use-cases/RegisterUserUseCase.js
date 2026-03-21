import { User, UserRole } from '../../domain/entities/User.js';
import { randomUUID } from 'node:crypto';
export class RegisterUserUseCase {
    userRepository;
    passwordHasher;
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(request) {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new Error('User is already in the system');
        }
        const hashedPassword = await this.passwordHasher.hash(request.password);
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
