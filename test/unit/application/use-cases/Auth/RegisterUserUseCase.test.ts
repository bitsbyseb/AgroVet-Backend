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
            findByUsername: vi.fn(),
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
        (mockUserRepository.findByUsername as any).mockResolvedValue(null);
        (mockPasswordHasher.hash as any).mockResolvedValue('hashedPassword123');

        await useCase.execute({
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securePassword',
            role: UserRole.VETERINARIAN
        });

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
        expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('johndoe');
        expect(mockPasswordHasher.hash).toHaveBeenCalledWith('securePassword');
        expect(mockUserRepository.save).toHaveBeenCalled();
        
        const savedUser = (mockUserRepository.save as any).mock.calls[0][0];
        expect(savedUser).toBeInstanceOf(User);
        expect(savedUser.username).toBe('johndoe');
        expect(savedUser.password).toBe('hashedPassword123');
    });

    it('debería lanzar un error si el correo electrónico ya está registrado', async () => {
        (mockUserRepository.findByEmail as any).mockResolvedValue(new User({
            id: '123', username: 'existing', email: 'john@example.com', password: 'pwd', role: UserRole.VETERINARIAN
        }));

        await expect(useCase.execute({
            username: 'johndoe',
            email: 'john@example.com',
            password: 'securePassword',
            role: UserRole.VETERINARIAN
        })).rejects.toThrow('El correo electrónico ya está registrado en el sistema');

        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si el nombre de usuario ya está en uso', async () => {
        (mockUserRepository.findByEmail as any).mockResolvedValue(null);
        (mockUserRepository.findByUsername as any).mockResolvedValue(new User({
            id: '456', username: 'johndoe', email: 'other@example.com', password: 'pwd', role: UserRole.VETERINARIAN
        }));

        await expect(useCase.execute({
            username: 'johndoe',
            email: 'newuser@example.com',
            password: 'securePassword',
            role: UserRole.VETERINARIAN
        })).rejects.toThrow('El nombre de usuario ya está en uso');

        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debería bloquear el registro si se intenta crear un usuario con rol de Administrador', async () => {
        (mockUserRepository.findByEmail as any).mockResolvedValue(null);
        (mockUserRepository.findByUsername as any).mockResolvedValue(null);
        (mockPasswordHasher.hash as any).mockResolvedValue('hashed');

        await expect(useCase.execute({
            username: 'adminuser',
            email: 'admin@example.com',
            password: 'pwd',
            role: UserRole.ADMIN
        })).rejects.toThrow('No autorizado: No se pueden crear usuarios con rol de Administrador');

        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debería permitir registrar un usuario con rol de Propietario (OWNER) y vincular su perfil de Owner si existe', async () => {
        const mockOwnerRepository = {
            findByEmail: vi.fn(),
            update: vi.fn()
        };

        const useCaseWithOwner = new RegisterUserUseCase(
            mockUserRepository as any,
            mockPasswordHasher as any,
            mockEmailService as any,
            mockOwnerRepository as any
        );

        (mockUserRepository.findByEmail as any).mockResolvedValue(null);
        (mockUserRepository.findByUsername as any).mockResolvedValue(null);
        (mockPasswordHasher.hash as any).mockResolvedValue('hashedOwnerPwd');

        const existingOwner = {
            id: 'owner-uuid-1',
            name: 'Carlos Ruiz',
            email: 'carlos@agrovet.com',
            userId: null
        };
        mockOwnerRepository.findByEmail.mockResolvedValue(existingOwner);

        await useCaseWithOwner.execute({
            username: 'carlosruiz',
            email: 'carlos@agrovet.com',
            password: 'securePassword123',
            role: UserRole.OWNER
        });

        expect(mockUserRepository.save).toHaveBeenCalled();
        const savedUser = (mockUserRepository.save as any).mock.calls[0][0];
        expect(savedUser.role).toBe(UserRole.OWNER);

        expect(mockOwnerRepository.findByEmail).toHaveBeenCalledWith('carlos@agrovet.com');
        expect(mockOwnerRepository.update).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: savedUser.id
            })
        );
    });

    it('debería crear automáticamente la entidad Owner si no existe al registrar un usuario OWNER', async () => {
        const mockOwnerRepository = {
            findByEmail: vi.fn(),
            save: vi.fn(),
            update: vi.fn()
        };

        const useCaseWithOwner = new RegisterUserUseCase(
            mockUserRepository as any,
            mockPasswordHasher as any,
            mockEmailService as any,
            mockOwnerRepository as any
        );

        (mockUserRepository.findByEmail as any).mockResolvedValue(null);
        (mockUserRepository.findByUsername as any).mockResolvedValue(null);
        (mockPasswordHasher.hash as any).mockResolvedValue('hashedOwnerPwd');
        mockOwnerRepository.findByEmail.mockResolvedValue(null);

        await useCaseWithOwner.execute({
            username: 'mariagomez',
            email: 'maria@agrovet.com',
            password: 'securePassword123',
            role: UserRole.OWNER,
            ownerData: {
                name: 'Maria Gomez',
                document: '1098765432',
                phone: '3109876543',
                address: 'Vereda El Salitre',
                ownerType: 'rural'
            }
        });

        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(mockOwnerRepository.save).toHaveBeenCalled();
        const savedOwner = mockOwnerRepository.save.mock.calls[0][0];
        expect(savedOwner.name).toBe('Maria Gomez');
        expect(savedOwner.document).toBe('1098765432');
        expect(savedOwner.email).toBe('maria@agrovet.com');
        expect(savedOwner.phone).toBe('3109876543');
        expect(savedOwner.address).toBe('Vereda El Salitre');
        expect(savedOwner.ownerType).toBe('rural');
        expect(savedOwner.userId).toBeDefined();
    });
});
