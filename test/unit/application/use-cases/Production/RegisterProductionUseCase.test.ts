import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterProductionUseCase } from '@application/use-cases/Production/RegisterProductionUseCase.js';
import { ProductionData, ProductionPurpose } from '@domain/entities/ProductionData.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ProductionDataRepository } from '@domain/repositories/ProductionDataRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterProductionUseCase', () => {
    let mockProductionRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterProductionUseCase;

    beforeEach(() => {
        mockProductionRepo = { save: vi.fn(), findByAnimalId: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterProductionUseCase(mockProductionRepo as unknown as ProductionDataRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should register production successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        await useCase.execute({
            animalId,
            weight: 500,
            milkProduction: 10,
            purpose: ProductionPurpose.MILK,
            recordDate: new Date()
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockProductionRepo.save).toHaveBeenCalled();
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'invalid', weight: 10, milkProduction: null, purpose: ProductionPurpose.MEAT, recordDate: new Date()
        })).rejects.toThrow('Animal not found');

        expect(mockProductionRepo.save).not.toHaveBeenCalled();
    });
});
