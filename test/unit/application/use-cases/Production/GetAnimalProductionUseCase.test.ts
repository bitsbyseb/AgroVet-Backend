import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAnimalProductionUseCase } from '@application/use-cases/Production/GetAnimalProductionUseCase.js';
import { ProductionData, ProductionPurpose } from '@domain/entities/ProductionData.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ProductionDataRepository } from '@domain/repositories/ProductionDataRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetAnimalProductionUseCase', () => {
    let mockProductionRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: GetAnimalProductionUseCase;

    beforeEach(() => {
        mockProductionRepo = { findByAnimalId: vi.fn(), save: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new GetAnimalProductionUseCase(mockProductionRepo as unknown as ProductionDataRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should get animal production successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        const mockProductions = [new ProductionData(randomUUID(), animalId, 500, null, ProductionPurpose.MEAT, new Date())];
        
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);
        (mockProductionRepo.findByAnimalId as any).mockResolvedValue(mockProductions);

        const result = await useCase.execute(animalId);

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockProductionRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toEqual(mockProductions);
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute('invalid')).rejects.toThrow('Animal not found');

        expect(mockProductionRepo.findByAnimalId).not.toHaveBeenCalled();
    });
});
