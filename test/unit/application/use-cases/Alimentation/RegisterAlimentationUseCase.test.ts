import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterAlimentationUseCase } from '@application/use-cases/Alimentation/RegisterAlimentationUseCase.js';
import { Alimentation, weightUnits, frequency } from '@domain/entities/Alimentation.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import { Food } from '@domain/entities/Food.js';
import type { AlimentationRepository } from '@domain/repositories/AlimentationRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { FoodRepository } from '@domain/repositories/FoodRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterAlimentationUseCase', () => {
    let mockAlimentationRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let mockFoodRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterAlimentationUseCase;

    beforeEach(() => {
        mockAlimentationRepo = { save: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockFoodRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;

        useCase = new RegisterAlimentationUseCase(
            mockAlimentationRepo as unknown as AlimentationRepository,
            mockAnimalRepo as unknown as AnimalRepository,
            mockFoodRepo as unknown as FoodRepository
        );
    });

    it('debería registrar una nueva alimentación exitosamente', async () => {
        const animalId = randomUUID();
        const foodId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Rex', speciesType.CANINE, animalType.URBAN, 'Bulldog', Gender.MALE, new Date(), Status.ACTIVE, 'Brown', randomUUID());
        const mockFood = new Food(foodId, 'Pedigree', 'Brand', 'Good', 10, 100, new Date());

        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);
        (mockFoodRepo.findById as any).mockResolvedValue(mockFood);

        const request = {
            id: randomUUID(),
            animalId,
            foodId,
            count: 300,
            unit: weightUnits.g,
            frequency: frequency.daily,
            startDate: new Date(),
            endDate: new Date(),
            observations: 'No issues'
        };

        await useCase.execute(request);

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockFoodRepo.findById).toHaveBeenCalledWith(foodId);
        expect(mockAlimentationRepo.save).toHaveBeenCalled();
        
        const savedAlimentation = (mockAlimentationRepo.save as any).mock.calls[0][0];
        expect(savedAlimentation).toBeInstanceOf(Alimentation);
        expect(savedAlimentation.id).toBe(request.id);
        expect(savedAlimentation.count).toBe(request.count);
    });

    it('debería arrojar un error si el animal no existe', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            id: randomUUID(), animalId: 'invalid', foodId: 'food', count: 1, unit: weightUnits.kg, frequency: frequency.daily, startDate: new Date(), endDate: new Date(), observations: ''
        })).rejects.toThrow('Animal not found');

        expect(mockFoodRepo.findById).not.toHaveBeenCalled();
        expect(mockAlimentationRepo.save).not.toHaveBeenCalled();
    });

    it('debería arrojar un error si el alimento no existe', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Rex', speciesType.CANINE, animalType.URBAN, 'Bulldog', Gender.MALE, new Date(), Status.ACTIVE, 'Brown', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);
        (mockFoodRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            id: randomUUID(), animalId, foodId: 'invalid', count: 1, unit: weightUnits.kg, frequency: frequency.daily, startDate: new Date(), endDate: new Date(), observations: ''
        })).rejects.toThrow('Food not found');

        expect(mockAlimentationRepo.save).not.toHaveBeenCalled();
    });
});
