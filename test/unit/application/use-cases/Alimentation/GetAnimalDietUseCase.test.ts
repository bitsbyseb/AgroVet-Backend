import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAnimalDietUseCase } from '@application/use-cases/Alimentation/GetAnimalDietUseCase.js';
import { Alimentation, weightUnits, frequency } from '@domain/entities/Alimentation.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { AlimentationRepository } from '@domain/repositories/AlimentationRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetAnimalDietUseCase', () => {
    let mockAlimentationRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: GetAnimalDietUseCase;

    beforeEach(() => {
        mockAlimentationRepo = {
            findByAnimalId: vi.fn(),
            save: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;

        mockAnimalRepo = {
            findById: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;

        useCase = new GetAnimalDietUseCase(
            mockAlimentationRepo as unknown as AlimentationRepository,
            mockAnimalRepo as unknown as AnimalRepository
        );
    });

    it('debería retornar la dieta de un animal existente', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Rex', speciesType.CANINE, animalType.URBAN, 'Bulldog', Gender.MALE, new Date(), Status.ACTIVE, 'Brown', randomUUID());
        const mockDiet = [
            new Alimentation(randomUUID(), animalId, randomUUID(), 200, weightUnits.g, frequency.daily, new Date(), new Date(), 'Obs 1')
        ];

        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);
        (mockAlimentationRepo.findByAnimalId as any).mockResolvedValue(mockDiet);

        const result = await useCase.execute(animalId);

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockAlimentationRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toEqual(mockDiet);
    });

    it('debería arrojar un error si el animal no existe', async () => {
        const animalId = randomUUID();
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute(animalId)).rejects.toThrow('Animal not found');

        expect(mockAlimentationRepo.findByAnimalId).not.toHaveBeenCalled();
    });
});
