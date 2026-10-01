import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetOwnerMedicalHistoryUseCase } from '@application/use-cases/Owner/GetOwnerMedicalHistoryUseCase.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';

// ─── Helpers de construcción ─────────────────────────────────────────────────

function buildOwner(): Owner {
    return new Owner(
        'owner-uuid-1',
        'María García',
        '87654321',
        '555-0002',
        'maria@example.com',
        'Carrera 5 # 10-20',
        OwnerType.RURAL,
        'user-uuid-1'
    );
}

function buildAnimal(ownerId: string, id = 'animal-uuid-1'): Animal {
    return new Animal(
        id,
        'Canela',
        speciesType.BOVINE,
        animalType.RURAL,
        'Holstein',
        Gender.FEMALE,
        new Date('2020-06-01'),
        Status.ACTIVE,
        'café',
        ownerId,
        null
    );
}

function buildMedicalHistory(animalId: string): MedicalHistory {
    return new MedicalHistory(
        'history-uuid-1',
        animalId,
        new Date('2024-03-15'),
        'Revisión rutinaria',
        'Animal sano',
        'Vitaminas',
        'Sin observaciones adicionales',
        'vet-user-uuid',
        new Date('2024-03-15'),
        new Date('2024-03-15')
    );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Caso de Uso (Sprint 11): GetOwnerMedicalHistoryUseCase', () => {
    let mockOwnerRepository: any;
    let mockAnimalRepository: any;
    let mockMedicalHistoryRepository: any;
    let useCase: GetOwnerMedicalHistoryUseCase;

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
        };

        mockAnimalRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            findByOwnerId: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        mockMedicalHistoryRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            findByAnimalId: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        useCase = new GetOwnerMedicalHistoryUseCase(
            mockOwnerRepository as OwnerRepository,
            mockAnimalRepository as AnimalRepository,
            mockMedicalHistoryRepository as MedicalHistoryRepository
        );
    });

    it('debería retornar el historial clínico completo del animal del propietario', async () => {
        const owner = buildOwner();
        const animal = buildAnimal(owner.id);
        const history = buildMedicalHistory(animal.id);

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(animal);
        mockMedicalHistoryRepository.findByAnimalId.mockResolvedValue([history]);

        const result = await useCase.execute('user-uuid-1', animal.id);

        expect(mockOwnerRepository.findByUserId).toHaveBeenCalledWith('user-uuid-1');
        expect(mockAnimalRepository.findById).toHaveBeenCalledWith(animal.id);
        expect(mockMedicalHistoryRepository.findByAnimalId).toHaveBeenCalledWith(animal.id);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: 'history-uuid-1',
            animalId: animal.id,
            reason: 'Revisión rutinaria',
            diagnosis: 'Animal sano',
            treatment: 'Vitaminas'
        });
    });

    it('debería lanzar error 403 si el animal no pertenece al propietario autenticado', async () => {
        const owner = buildOwner();
        // El animal pertenece a OTRO propietario
        const animalDeOtro = buildAnimal('otro-owner-uuid', 'animal-ajeno-uuid');

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(animalDeOtro);

        await expect(useCase.execute('user-uuid-1', 'animal-ajeno-uuid')).rejects.toThrow(
            'Acceso no autorizado: el animal solicitado no pertenece a este propietario.'
        );
        expect(mockMedicalHistoryRepository.findByAnimalId).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el userId no tiene perfil de propietario asociado', async () => {
        mockOwnerRepository.findByUserId.mockResolvedValue(null);

        await expect(useCase.execute('user-sin-perfil', 'cualquier-animal')).rejects.toThrow(
            'No se encontró un perfil de propietario asociado a este usuario.'
        );
        expect(mockAnimalRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el animalId no existe en el sistema', async () => {
        const owner = buildOwner();
        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute('user-uuid-1', 'animal-inexistente')).rejects.toThrow(
            'El animal con ID "animal-inexistente" no fue encontrado.'
        );
        expect(mockMedicalHistoryRepository.findByAnimalId).not.toHaveBeenCalled();
    });

    it('debería retornar array vacío si el animal existe pero no tiene historial clínico', async () => {
        const owner = buildOwner();
        const animal = buildAnimal(owner.id);

        mockOwnerRepository.findByUserId.mockResolvedValue(owner);
        mockAnimalRepository.findById.mockResolvedValue(animal);
        mockMedicalHistoryRepository.findByAnimalId.mockResolvedValue([]);

        const result = await useCase.execute('user-uuid-1', animal.id);

        expect(result).toHaveLength(0);
    });
});
