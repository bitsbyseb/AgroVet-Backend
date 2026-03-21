import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { PasswordHasher } from '../../domain/services/PasswordHasher.js';
import type { TokenService } from '../../domain/services/TokenService.js';

export interface LoginUserRequest {
    email: string;
    password: string;
}

export class LoginUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private tokenService: TokenService
    ) {}

    async execute(request: LoginUserRequest): Promise<string> {
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new Error('Invalid Credentials');
        }

        const isValid = await this.passwordHasher.compare(request.password, user.password);
        if (!isValid) {
            throw new Error('Invalid Credentials');
        }

        return await this.tokenService.generateToken({
            sub: user.id,
            role: user.role,
        });
    }
}
