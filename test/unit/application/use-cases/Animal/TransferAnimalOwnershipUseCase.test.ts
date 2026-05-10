import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransferAnimalOwnershipUseCase } from '@application/use-cases/Animal/TransferAnimalOwnershipUseCase.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';

describe('Caso de Uso: Transferir Propiedad de un Animal (TransferAnimalOwnershipUseCase)', () => {
    let mockAnimalRepository: any;
    let mockOwnerRepository: any;
    let useCase: TransferAnimalOwnershipUseCase;

    beforeEach(() => {
        mockAnimalRepository = {
            findById: vi.fn(),
            update: vi.fn()
        };
        mockOwnerRepository = {
            findById: vi.fn()
        };

        useCase = new TransferAnimalOwnershipUseCase(
            mockAnimalRepository as AnimalRepository,
            mockOwnerRepository as OwnerRepository
        );
    });

    it('debería transferir el animal al nuevo dueño de forma exitosa', async () => {
        const mockAnimal = new Animal(
            'animal-1',
            'Firulais',
            speciesType.CANINE,
            animalType.URBAN,
            'Labrador',
            Gender.MALE,
            new Date(),
            Status.ACTIVE,
            'Golden',
            'old-owner-id'
        );

        const mockNewOwner = new Owner('new-owner-id', 'John', '123', '123', 'e@e.com', 'A', OwnerType.URBAN);

        mockAnimalRepository.findById.mockResolvedValue(mockAnimal);
        mockOwnerRepository.findById.mockResolvedValue(mockNewOwner);

        await useCase.execute({
            animalId: 'animal-1',
            newOwnerId: 'new-owner-id'
        });

        expect(mockAnimalRepository.findById).toHaveBeenCalledWith('animal-1');
        expect(mockOwnerRepository.findById).toHaveBeenCalledWith('new-owner-id');
        expect(mockAnimal.ownerId).toBe('new-owner-id'); // verify state mutation
        expect(mockAnimalRepository.update).toHaveBeenCalledWith(mockAnimal);
    });

    it('debería lanzar un error si el animal a transferir no existe', async () => {
        mockAnimalRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'nonexistent-animal',
            newOwnerId: 'new-owner-id'
        })).rejects.toThrow('Animal not found');

        expect(mockOwnerRepository.findById).not.toHaveBeenCalled();
        expect(mockAnimalRepository.update).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si el nuevo dueño no está registrado en el sistema', async () => {
        const mockAnimal = new Animal(
            'animal-1', 'Name', speciesType.CANINE, animalType.URBAN, 'Breed', Gender.MALE, new Date(), Status.ACTIVE, 'Color', 'old-owner-id'
        );

        mockAnimalRepository.findById.mockResolvedValue(mockAnimal);
        mockOwnerRepository.findById.mockResolvedValue(null); // New owner not found

        await expect(useCase.execute({
            animalId: 'animal-1',
            newOwnerId: 'nonexistent-owner'
        })).rejects.toThrow('New owner does not exist');

        expect(mockAnimalRepository.update).not.toHaveBeenCalled();
    });

    it('debería impedir la transferencia si el nuevo dueño es la misma persona', async () => {
        const mockAnimal = new Animal(
            'animal-1', 'Name', speciesType.CANINE, animalType.URBAN, 'Breed', Gender.MALE, new Date(), Status.ACTIVE, 'Color', 'same-owner-id'
        );
        const mockOwner = new Owner('same-owner-id', 'John', '123', '123', 'e@e.com', 'A', OwnerType.URBAN);

        mockAnimalRepository.findById.mockResolvedValue(mockAnimal);
        mockOwnerRepository.findById.mockResolvedValue(mockOwner);

        // The entity's business logic should throw "Animal is already owned by this person"
        await expect(useCase.execute({
            animalId: 'animal-1',
            newOwnerId: 'same-owner-id'
        })).rejects.toThrow('Animal is already owned by this person');

        expect(mockAnimalRepository.update).not.toHaveBeenCalled();
    });
});
