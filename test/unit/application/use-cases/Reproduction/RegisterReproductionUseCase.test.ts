import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterReproductionUseCase } from '@application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ReproductionRepository } from '@domain/repositories/ReproductionRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterReproductionUseCase', () => {
    let mockReproductionRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterReproductionUseCase;

    beforeEach(() => {
        mockReproductionRepo = { save: vi.fn(), findByAnimalId: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterReproductionUseCase(mockReproductionRepo as unknown as ReproductionRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should register reproduction successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        await useCase.execute({
            animalId,
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            lastCalvingDate: '2023-01-01',
            offspringCount: 1,
            breedingType: BreedingType.NATURAL
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockReproductionRepo.save).toHaveBeenCalled();
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'invalid', reproductiveStatus: ReproductiveStatus.PREGNANT, lastCalvingDate: null, offspringCount: 0, breedingType: null
        })).rejects.toThrow('Animal not found');

        expect(mockReproductionRepo.save).not.toHaveBeenCalled();
    });
});
