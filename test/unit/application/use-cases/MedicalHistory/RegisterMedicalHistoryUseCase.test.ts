import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/RegisterMedicalHistoryUseCase.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterMedicalHistoryUseCase', () => {
    let mockHistoryRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterMedicalHistoryUseCase;

    beforeEach(() => {
        mockHistoryRepo = { save: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterMedicalHistoryUseCase(mockHistoryRepo as unknown as MedicalHistoryRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should register medical history successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Rex', speciesType.CANINE, animalType.URBAN, 'Bulldog', Gender.MALE, new Date(), Status.ACTIVE, 'Brown', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        await useCase.execute({
            animalId,
            date: new Date(),
            reason: 'R',
            diagnosis: 'D',
            treatment: 'T',
            observations: 'O',
            createdBy: 'U'
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockHistoryRepo.save).toHaveBeenCalled();
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'invalid', date: new Date(), reason: 'R', diagnosis: 'D', treatment: 'T', observations: 'O', createdBy: 'U'
        })).rejects.toThrow('Animal not found');

        expect(mockHistoryRepo.save).not.toHaveBeenCalled();
    });
});
