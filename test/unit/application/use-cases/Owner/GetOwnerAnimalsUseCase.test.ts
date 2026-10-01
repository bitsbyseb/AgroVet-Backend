import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetOwnerAnimalsUseCase } from '@application/use-cases/Owner/GetOwnerAnimalsUseCase.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';

// ─── Helpers de construcción ─────────────────────────────────────────────────

function buildOwner(overrides: Partial<ConstructorParameters<typeof Owner>[0]> = {}): Owner {
    return new Owner(
        'owner-uuid-1',
        'Juan Pérez',
        '12345678',
        '555-0001',
        'juan@example.com',
        'Calle 1 # 2-3',
        OwnerType.URBAN,
        'user-uuid-1'
    );
}

function buildAnimal(ownerId: string): Animal {
    return new Animal(
        'animal-uuid-1',
        'Firulais',
        speciesType.CANINE,
        animalType.URBAN,
        'Labrador',
        Gender.MALE,
        new Date('2022-01-15'),
        Status.ACTIVE,
        'dorado',
        ownerId,
        null
    );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Caso de Uso (Sprint 11): GetOwnerAnimalsUseCase', () => {
    let mockOwnerRepository: jest.Mocked<OwnerRepository>;
    let mockAnimalRepository: jest.Mocked<AnimalRepository>;
    let useCase: GetOwnerAnimalsUseCase;

    beforeEach(() => {
        mockOwnerRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            findByDocument: vi.fn(),
            findByEmail: vi.fn(),
            findByUserId: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        } as any;

        mockAnimalRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            findByOwnerId: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        } as any;

        useCase = new GetOwnerAnimalsUseCase(mockOwnerRepository, mockAnimalRepository);
    });

    it('debería retornar la lista de animales del propietario autenticado', async () => {
        const userId = 'user-uuid-1';
        const owner = buildOwner();
        const animal = buildAnimal(owner.id);

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([animal]);

        const result = await useCase.execute(userId);

        expect(mockOwnerRepository.findByUserId).toHaveBeenCalledWith(userId);
        expect(mockAnimalRepository.findByOwnerId).toHaveBeenCalledWith(owner.id);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: 'animal-uuid-1',
            name: 'Firulais',
            species: speciesType.CANINE,
            status: Status.ACTIVE,
            ownerId: owner.id
        });
    });

    it('debería retornar lista vacía si el propietario no tiene animales registrados', async () => {
        const owner = buildOwner();
        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([]);

        const result = await useCase.execute('user-uuid-1');

        expect(result).toHaveLength(0);
    });

    it('debería lanzar error si el userId no tiene un perfil de propietario asociado', async () => {
        mockOwnerRepository.findByUserId.mockResolvedValue(null);

        await expect(useCase.execute('user-sin-perfil')).rejects.toThrow(
            'No se encontró un perfil de propietario asociado a este usuario.'
        );
        expect(mockAnimalRepository.findByOwnerId).not.toHaveBeenCalled();
    });

    it('debería mapear correctamente paddockId como null cuando no existe', async () => {
        const owner = buildOwner();
        const animal = buildAnimal(owner.id); // paddockId = null por defecto en el helper
        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findByOwnerId.mockResolvedValue([animal]);

        const result = await useCase.execute('user-uuid-1');

        expect(result[0].paddockId).toBeNull();
    });
});
