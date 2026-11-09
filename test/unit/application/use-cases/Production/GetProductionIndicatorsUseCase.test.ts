import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProductionIndicatorsUseCase } from '@application/use-cases/Production/GetProductionIndicatorsUseCase.js';
import { ProductionData, ProductionPurpose } from '@domain/entities/ProductionData.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { ProductionDataRepository } from '@domain/repositories/ProductionDataRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetProductionIndicatorsUseCase (HU17)', () => {
    let mockProductionRepo: {
        save: ReturnType<typeof vi.fn>;
        findByAnimalId: ReturnType<typeof vi.fn>;
        findByAnimalIdAndPeriod: ReturnType<typeof vi.fn>;
    };
    let mockAnimalRepo: {
        findById: ReturnType<typeof vi.fn>;
    };
    let useCase: GetProductionIndicatorsUseCase;

    beforeEach(() => {
        mockProductionRepo = {
            save: vi.fn(),
            findByAnimalId: vi.fn(),
            findByAnimalIdAndPeriod: vi.fn()
        };
        mockAnimalRepo = {
            findById: vi.fn()
        };
        useCase = new GetProductionIndicatorsUseCase(
            mockProductionRepo as unknown as ProductionDataRepository,
            mockAnimalRepo as unknown as AnimalRepository
        );
    });

    it('should calculate period indicators and cumulative weight gain evolution (HU17T2, HU17T3, HU17T4)', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(
            animalId,
            'Margarita',
            speciesType.BOVINE,
            animalType.RURAL,
            'Holstein',
            Gender.FEMALE,
            new Date('2024-01-01'),
            Status.ACTIVE,
            'White/Black',
            randomUUID()
        );
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);

        const records = [
            new ProductionData(
                randomUUID(),
                animalId,
                450,
                20,
                ProductionPurpose.MILK,
                new Date('2026-10-01T10:00:00Z'),
                new Date('2026-10-01'),
                1.5,
                'Alta'
            ),
            new ProductionData(
                randomUUID(),
                animalId,
                453,
                22,
                ProductionPurpose.MILK,
                new Date('2026-10-05T10:00:00Z'),
                new Date('2026-10-05'),
                3.0,
                'Alta'
            ),
            new ProductionData(
                randomUUID(),
                animalId,
                455,
                18,
                ProductionPurpose.MILK,
                new Date('2026-10-10T10:00:00Z'),
                new Date('2026-10-10'),
                2.0,
                'Media'
            )
        ];
        mockProductionRepo.findByAnimalIdAndPeriod.mockResolvedValue(records);

        const result = await useCase.execute({
            animalId,
            from: '2026-10-01',
            to: '2026-10-15'
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(result.animalId).toBe(animalId);

        // Period Indicators (HU17T2, HU17T3)
        expect(result.period.totalRecords).toBe(3);
        expect(result.period.totalWeight).toBe(1358);
        expect(result.period.avgWeight).toBe(452.67);
        expect(result.period.totalMilkProduction).toBe(60);
        expect(result.period.avgMilkProduction).toBe(20);
        expect(result.period.totalWeightGain).toBe(6.5);
        expect(result.period.qualityDistribution).toEqual({ Alta: 2, Media: 1 });
        expect(result.period.purposeDistribution).toEqual({ [ProductionPurpose.MILK]: 3 });

        // Evolution and cumulative weight gain (HU17T4)
        expect(result.weightGainEvolution).toHaveLength(3);
        expect(result.weightGainEvolution[0].weightGain).toBe(1.5);
        expect(result.weightGainEvolution[0].cumulativeWeightGain).toBe(1.5);

        expect(result.weightGainEvolution[1].weightGain).toBe(3.0);
        expect(result.weightGainEvolution[1].cumulativeWeightGain).toBe(4.5);

        expect(result.weightGainEvolution[2].weightGain).toBe(2.0);
        expect(result.weightGainEvolution[2].cumulativeWeightGain).toBe(6.5);
    });

    it('should return empty period metrics when no records exist in the period', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(
            animalId,
            'Toro',
            speciesType.BOVINE,
            animalType.RURAL,
            'Angus',
            Gender.MALE,
            new Date('2023-01-01'),
            Status.ACTIVE,
            'Black',
            randomUUID()
        );
        mockAnimalRepo.findById.mockResolvedValue(mockAnimal);
        mockProductionRepo.findByAnimalIdAndPeriod.mockResolvedValue([]);

        const result = await useCase.execute({ animalId });

        expect(result.period.totalRecords).toBe(0);
        expect(result.period.totalWeight).toBeNull();
        expect(result.period.avgWeight).toBeNull();
        expect(result.period.totalMilkProduction).toBeNull();
        expect(result.period.avgMilkProduction).toBeNull();
        expect(result.period.totalWeightGain).toBeNull();
        expect(result.period.qualityDistribution).toEqual({});
        expect(result.period.purposeDistribution).toEqual({});
        expect(result.weightGainEvolution).toEqual([]);
    });

    it('should throw an error if the animal is not found', async () => {
        mockAnimalRepo.findById.mockResolvedValue(null);

        await expect(
            useCase.execute({ animalId: 'non-existent-id' })
        ).rejects.toThrow('Animal not found: non-existent-id');

        expect(mockProductionRepo.findByAnimalIdAndPeriod).not.toHaveBeenCalled();
    });
});
