import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUserUseCase } from '@application/use-cases/Auth/LoginUserUseCase.js';
import { User, UserRole } from '@domain/entities/User.js';
import type { UserRepository } from '@domain/repositories/UserRepository.js';
import type { PasswordHasher } from '@domain/services/PasswordHasher.js';
import type { TokenService } from '@domain/services/TokenService.js';

describe('Caso de Uso: Iniciar Sesión (LoginUserUseCase)', () => {
    let mockUserRepository: any;
    let mockPasswordHasher: any;
    let mockTokenService: any;
    let useCase: LoginUserUseCase;

    beforeEach(() => {
        mockUserRepository = { findByEmail: vi.fn() };
        mockPasswordHasher = { compare: vi.fn() };
        mockTokenService = { generateToken: vi.fn() };

        useCase = new LoginUserUseCase(
            mockUserRepository as UserRepository,
            mockPasswordHasher as PasswordHasher,
            mockTokenService as TokenService
        );
    });

    it('debería iniciar sesión correctamente y retornar el token de acceso', async () => {
        const mockUser = new User({
            id: 'user-123',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: UserRole.VETERINARIAN
        });

        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        mockPasswordHasher.compare.mockResolvedValue(true);
        mockTokenService.generateToken.mockResolvedValue('mocked-jwt-token');

        const result = await useCase.execute({
            email: 'john@example.com',
            password: 'password123'
        });

        expect(result).toBe('mocked-jwt-token');
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
        expect(mockPasswordHasher.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(mockTokenService.generateToken).toHaveBeenCalledWith({
            sub: 'user-123',
            role: UserRole.VETERINARIAN
        });
    });

    it('debería arrojar un error de credenciales si el usuario no existe', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute({
            email: 'wrong@example.com',
            password: 'password123'
        })).rejects.toThrow('Invalid Credentials');

        expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
        expect(mockTokenService.generateToken).not.toHaveBeenCalled();
    });

    it('debería arrojar un error de credenciales si la contraseña es incorrecta', async () => {
        const mockUser = new User({
            id: 'user-123',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: UserRole.VETERINARIAN
        });

        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        mockPasswordHasher.compare.mockResolvedValue(false); // Wrong password

        await expect(useCase.execute({
            email: 'john@example.com',
            password: 'wrongPassword'
        })).rejects.toThrow('Invalid Credentials');

        expect(mockTokenService.generateToken).not.toHaveBeenCalled();
    });
});
