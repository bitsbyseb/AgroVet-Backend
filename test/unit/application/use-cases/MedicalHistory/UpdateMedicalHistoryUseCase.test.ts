import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/UpdateMedicalHistoryUseCase.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import type { MedicalHistoryRepository } from '@domain/repositories/MedicalHistoryRepository.js';
import { randomUUID } from 'node:crypto';

describe('UpdateMedicalHistoryUseCase (Sprint 17 - HU8/HU9)', () => {
    let mockRepo: { findById: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
    let useCase: UpdateMedicalHistoryUseCase;

    beforeEach(() => {
        mockRepo = {
            findById: vi.fn(),
            update: vi.fn().mockResolvedValue(undefined)
        };
        useCase = new UpdateMedicalHistoryUseCase(mockRepo as unknown as MedicalHistoryRepository);
    });

    it('debería actualizar diagnóstico, tratamiento y nuevos campos clínicos', async () => {
        const id = randomUUID();
        const mockHistory = new MedicalHistory(id, randomUUID(), new Date(), 'R', 'D', 'T', 'O', 'U');
        mockRepo.findById.mockResolvedValue(mockHistory);

        const updated = await useCase.execute(id, {
            diagnosis: 'Diagnóstico ampliado',
            treatment: 'Nuevo antibiótico',
            evolution: 'Paciente afebril y más reactivo',
            weight: 28.5,
            bodyConditionScore: 3.5,
            heartRate: 88,
            temperature: 38.4
        });

        expect(mockRepo.findById).toHaveBeenCalledWith(id);
        expect(mockRepo.update).toHaveBeenCalledWith(mockHistory);
        expect(updated.diagnosis).toBe('Diagnóstico ampliado');
        expect(updated.treatment).toBe('Nuevo antibiótico');
        expect(updated.evolution).toBe('Paciente afebril y más reactivo');
        expect(updated.weight).toBe(28.5);
        expect(updated.bodyConditionScore).toBe(3.5);
        expect(updated.heartRate).toBe(88);
        expect(updated.temperature).toBe(38.4);
    });

    it('debería rechazar actualización con peso menor o igual a cero', async () => {
        const id = randomUUID();
        const mockHistory = new MedicalHistory(id, randomUUID(), new Date(), 'R', 'D', 'T', 'O', 'U');
        mockRepo.findById.mockResolvedValue(mockHistory);

        await expect(useCase.execute(id, { weight: -2 })).rejects.toThrow('Weight must be a positive number');
        await expect(useCase.execute(id, { weight: 0 })).rejects.toThrow('Weight must be a positive number');
        expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('debería rechazar actualización con condición corporal no positiva', async () => {
        const id = randomUUID();
        const mockHistory = new MedicalHistory(id, randomUUID(), new Date(), 'R', 'D', 'T', 'O', 'U');
        mockRepo.findById.mockResolvedValue(mockHistory);

        await expect(useCase.execute(id, { bodyConditionScore: -1 })).rejects.toThrow('Body condition score must be a positive number');
        expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si el id de historia médica está vacío', async () => {
        await expect(useCase.execute('', { diagnosis: 'D' })).rejects.toThrow('Medical history ID is required');
        await expect(useCase.execute('   ', { diagnosis: 'D' })).rejects.toThrow('Medical history ID is required');
    });

    it('debería lanzar un error si la historia médica no existe', async () => {
        mockRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute('invalid-id', {})).rejects.toThrow('Medical history not found');
        expect(mockRepo.update).not.toHaveBeenCalled();
    });
});
