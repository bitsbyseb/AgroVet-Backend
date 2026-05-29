import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/UpdateMedicalHistoryUseCase.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';
import { randomUUID } from 'node:crypto';

describe('UpdateMedicalHistoryUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: UpdateMedicalHistoryUseCase;

    beforeEach(() => {
        mockRepo = {
            findById: vi.fn(),
            update: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new UpdateMedicalHistoryUseCase(mockRepo as unknown as MedicalHistoryRepository);
    });

    it('should update medical history successfully', async () => {
        const id = randomUUID();
        const mockHistory = new MedicalHistory(id, randomUUID(), new Date(), 'R', 'D', 'T', 'O', 'U');
        (mockRepo.findById as any).mockResolvedValue(mockHistory);

        await useCase.execute(id, { diagnosis: 'New D', treatment: 'New T' });

        expect(mockRepo.findById).toHaveBeenCalledWith(id);
        expect(mockRepo.update).toHaveBeenCalledWith(mockHistory);
        expect(mockHistory.diagnosis).toBe('New D');
        expect(mockHistory.treatment).toBe('New T');
    });

    it('should throw error if medical history not found', async () => {
        (mockRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute('invalid', {})).rejects.toThrow('Medical history not found');

        expect(mockRepo.update).not.toHaveBeenCalled();
    });
});
