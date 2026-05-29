import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUserUseCase } from '@application/use-cases/Auth/RegisterUserUseCase.js';
import { User, UserRole } from '@domain/entities/User.js';
import type { UserRepository } from '@domain/repositories/UserRepository.js';
import type { PasswordHasher } from '@domain/services/PasswordHasher.js';
import type { EmailService } from '@domain/services/EmailService.js';

describe('Caso de Uso: Registrar Usuario (RegisterUserUseCase)', () => {
    let mockUserRepository: ReturnType<typeof vi.fn>;
    let mockPasswordHasher: ReturnType<typeof vi.fn>;
    let mockEmailService: ReturnType<typeof vi.fn>;
    let useCase: RegisterUserUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: vi.fn(),
            save: vi.fn(),
        } as unknown as ReturnType<typeof vi.fn>;

        mockPasswordHasher = {
            hash: vi.fn(),
        } as unknown as ReturnType<typeof vi.fn>;

        mockEmailService = {
            send: vi.fn(),
        } as unknown as ReturnType<typeof vi.fn>;

        useCase = new RegisterUserUseCase(
            mockUserRepository as unknown as UserRepository,
            mockPasswordHasher as unknown as PasswordHasher,
            mockEmailService as unknown as EmailService
        );
    });

    it('debería crear un usuario nuevo exitosamente', async () => {
        (mockUserRepository.findByEmail as any).mockResolvedValue(null);
        (mockPasswordHasher.hash as any).mockResolvedValue('hashedPassword123');

        await useCase.execute({
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securePassword',
            role: UserRole.VETERINARIAN
        });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
        expect(mockPasswordHasher.hash).toHaveBeenCalledWith('securePassword');
        expect(mockUserRepository.save).toHaveBeenCalled();
        
        const savedUser = (mockUserRepository.save as any).mock.calls[0][0];
        expect(savedUser).toBeInstanceOf(User);
        expect(savedUser.username).toBe('johndoe');
        expect(savedUser.password).toBe('hashedPassword123');
    });

    it('debería lanzar un error si el usuario ya se encuentra registrado en el sistema', async () => {
        (mockUserRepository.findByEmail as any).mockResolvedValue(new User({
            id: '123', username: 'existing', email: 'john@example.com', password: 'pwd', role: UserRole.VETERINARIAN
        }));

        await expect(useCase.execute({
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securePassword',
            role: UserRole.VETERINARIAN
        })).rejects.toThrow('User is already in the system');

        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debería bloquear el registro si se intenta crear un usuario con rol de Administrador', async () => {
        (mockUserRepository.findByEmail as any).mockResolvedValue(null);
        (mockPasswordHasher.hash as any).mockResolvedValue('hashed');

        await expect(useCase.execute({
            username: 'adminuser',
            email: 'admin@example.com',
            password: 'pwd',
            role: UserRole.ADMIN
        })).rejects.toThrow('Unauthorized: Cannot create users with Administrator role');

        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
});
