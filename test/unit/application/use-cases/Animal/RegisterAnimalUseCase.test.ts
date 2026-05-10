import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterAnimalUseCase } from '@application/use-cases/Animal/RegisterAnimalUseCase.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import { animalType, speciesType, Gender } from '@domain/entities/Animal.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';

describe('Caso de Uso: Registrar Animal (RegisterAnimalUseCase)', () => {
    let mockAnimalRepository: any;
    let mockOwnerRepository: any;
    let useCase: RegisterAnimalUseCase;

    beforeEach(() => {
        mockAnimalRepository = { save: vi.fn() };
        mockOwnerRepository = { findById: vi.fn() };

        useCase = new RegisterAnimalUseCase(
            mockAnimalRepository as AnimalRepository,
            mockOwnerRepository as OwnerRepository
        );
    });

    it('debería registrar un animal nuevo sin problemas', async () => {
        const mockOwner = new Owner('owner-1', 'John', '123', '123', 'e@e.com', 'A', OwnerType.URBAN);
        mockOwnerRepository.findById.mockResolvedValue(mockOwner);

        const request = {
            name: 'Firulais',
            species: speciesType.CANINE,
            animalType: animalType.URBAN,
            breed: 'Labrador',
            gender: Gender.MALE,
            birthDate: '2023-01-01',
            color: 'Golden',
            ownerId: 'owner-1'
        };

        await useCase.execute(request);

        expect(mockOwnerRepository.findById).toHaveBeenCalledWith('owner-1');
        expect(mockAnimalRepository.save).toHaveBeenCalled();
        
        const savedAnimal = mockAnimalRepository.save.mock.calls[0][0];
        expect(savedAnimal.name).toBe('Firulais');
        expect(savedAnimal.ownerId).toBe('owner-1');
    });

    it('debería arrojar un error indicando que el dueño no fue encontrado', async () => {
        mockOwnerRepository.findById.mockResolvedValue(null);

        const request = {
            name: 'Firulais',
            species: speciesType.CANINE,
            animalType: animalType.URBAN,
            breed: 'Labrador',
            gender: Gender.MALE,
            birthDate: '2023-01-01',
            color: 'Golden',
            ownerId: 'nonexistent-owner'
        };

        await expect(useCase.execute(request)).rejects.toThrow('Owner not found');
        expect(mockAnimalRepository.save).not.toHaveBeenCalled();
    });
});
