import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListMedicalHistoriesUseCase } from '@application/use-cases/MedicalHistory/ListMedicalHistoriesUseCase.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';
import { randomUUID } from 'node:crypto';

describe('ListMedicalHistoriesUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: ListMedicalHistoriesUseCase;

    beforeEach(() => {
        mockRepo = {
            findAll: vi.fn(),
            findByAnimalId: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new ListMedicalHistoriesUseCase(mockRepo as unknown as MedicalHistoryRepository);
    });

    it('should list all medical histories', async () => {
        const mockHistories = [new MedicalHistory(randomUUID(), randomUUID(), new Date(), 'R', 'D', 'T', 'O', 'U')];
        (mockRepo.findAll as any).mockResolvedValue(mockHistories);

        const result = await useCase.execute();

        expect(mockRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockHistories);
    });

    it('should list medical histories by animal id', async () => {
        const animalId = randomUUID();
        const mockHistories = [new MedicalHistory(randomUUID(), animalId, new Date(), 'R', 'D', 'T', 'O', 'U')];
        (mockRepo.findByAnimalId as any).mockResolvedValue(mockHistories);

        const result = await useCase.executeByAnimal(animalId);

        expect(mockRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toEqual(mockHistories);
    });
});
