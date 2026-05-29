import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAnimalReproductionUseCase } from '@application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ReproductionRepository } from '@domain/repositories/ReproductionRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetAnimalReproductionUseCase', () => {
    let mockReproductionRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: GetAnimalReproductionUseCase;

    beforeEach(() => {
        mockReproductionRepo = { findByAnimalId: vi.fn(), save: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new GetAnimalReproductionUseCase(mockReproductionRepo as unknown as ReproductionRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should get animal reproduction successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        const mockReproductions = [new Reproduction(randomUUID(), animalId, ReproductiveStatus.PREGNANT, '2023-01-01', 1, BreedingType.NATURAL)];
        
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);
        (mockReproductionRepo.findByAnimalId as any).mockResolvedValue(mockReproductions);

        const result = await useCase.execute(animalId);

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockReproductionRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toEqual(mockReproductions);
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute('invalid')).rejects.toThrow('Animal not found');

        expect(mockReproductionRepo.findByAnimalId).not.toHaveBeenCalled();
    });
});
