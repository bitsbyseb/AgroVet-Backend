import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListVaccinationsUseCase } from '@application/use-cases/Vaccination/ListVaccinationsUseCase.js';
import { Vaccination } from '@domain/entities/Vaccination.js';
import type { VaccinationRepository } from '@domain/repositories/VaccinationRepository.js';
import { randomUUID } from 'node:crypto';

describe('ListVaccinationsUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: ListVaccinationsUseCase;

    beforeEach(() => {
        mockRepo = {
            findAll: vi.fn(),
            findByAnimalId: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new ListVaccinationsUseCase(mockRepo as unknown as VaccinationRepository);
    });

    it('should list all vaccinations', async () => {
        const mockVaccinations = [new Vaccination(randomUUID(), randomUUID(), 'Rabies', new Date(), null, 'B123', 'Vet 1')];
        (mockRepo.findAll as any).mockResolvedValue(mockVaccinations);

        const result = await useCase.execute();

        expect(mockRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockVaccinations);
    });

    it('should list vaccinations by animal id', async () => {
        const animalId = randomUUID();
        const mockVaccinations = [new Vaccination(randomUUID(), animalId, 'Rabies', new Date(), null, 'B123', 'Vet 1')];
        (mockRepo.findByAnimalId as any).mockResolvedValue(mockVaccinations);

        const result = await useCase.executeByAnimal(animalId);

        expect(mockRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toEqual(mockVaccinations);
    });
});
