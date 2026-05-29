import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterVaccinationUseCase } from '@application/use-cases/Vaccination/RegisterVaccinationUseCase.js';
import { Vaccination } from '@domain/entities/Vaccination.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { VaccinationRepository } from '@domain/repositories/VaccinationRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterVaccinationUseCase', () => {
    let mockVaccinationRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterVaccinationUseCase;

    beforeEach(() => {
        mockVaccinationRepo = { save: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterVaccinationUseCase(mockVaccinationRepo as unknown as VaccinationRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should register vaccination successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Bessie', speciesType.BOVINE, animalType.RURAL, 'Angus', Gender.FEMALE, new Date(), Status.ACTIVE, 'Black', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        await useCase.execute({
            animalId,
            vaccineName: 'Rabies',
            applicationDate: new Date(),
            nextDoseDate: null,
            batchNumber: 'B123',
            administeredBy: 'Vet 1'
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockVaccinationRepo.save).toHaveBeenCalled();
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'invalid', vaccineName: 'Rabies', applicationDate: new Date(), nextDoseDate: null, batchNumber: 'B123', administeredBy: 'Vet 1'
        })).rejects.toThrow('Animal not found');

        expect(mockVaccinationRepo.save).not.toHaveBeenCalled();
    });
});
