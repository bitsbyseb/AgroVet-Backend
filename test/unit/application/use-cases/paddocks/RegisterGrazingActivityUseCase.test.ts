import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterGrazingActivityUseCase } from '@application/use-cases/paddocks/RegisterGrazingActivityUseCase.js';
import { Paddock, PaddockStatus } from '@domain/entities/Paddock.js';
import type { GrazingActivityRepository } from '@domain/repositories/GrazingActivityRepository.js';
import type { PaddockRepository } from '@domain/repositories/PaddockRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterGrazingActivityUseCase Unit Tests', () => {
    let mockGrazingRepo: {
        save: ReturnType<typeof vi.fn>;
        findById: ReturnType<typeof vi.fn>;
        findByPaddockId: ReturnType<typeof vi.fn>;
        findActiveByPaddockId: ReturnType<typeof vi.fn>;
        findByAnimalId: ReturnType<typeof vi.fn>;
        findAll: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    let mockPaddockRepo: {
        save: ReturnType<typeof vi.fn>;
        findById: ReturnType<typeof vi.fn>;
        findByName: ReturnType<typeof vi.fn>;
        findAll: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    let useCase: RegisterGrazingActivityUseCase;

    const paddockId = randomUUID();
    const animalId1 = randomUUID();
    const animalId2 = randomUUID();

    beforeEach(() => {
        mockGrazingRepo = {
            save: vi.fn().mockResolvedValue(undefined),
            findById: vi.fn(),
            findByPaddockId: vi.fn(),
            findActiveByPaddockId: vi.fn(),
            findByAnimalId: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        mockPaddockRepo = {
            save: vi.fn(),
            findById: vi.fn(),
            findByName: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        useCase = new RegisterGrazingActivityUseCase(
            mockGrazingRepo as unknown as GrazingActivityRepository,
            mockPaddockRepo as unknown as PaddockRepository
        );
    });

    it('should register a grazing activity successfully for an active paddock', async () => {
        const paddock = new Paddock(paddockId, 'Potrero 1', 30, 10, PaddockStatus.ACTIVE);
        mockPaddockRepo.findById.mockResolvedValue(paddock);

        const result = await useCase.execute({
            paddockId,
            animalIds: [animalId1, animalId2],
            entryDate: '2026-03-01T08:00:00.000Z',
            exitDate: '2026-03-05T17:00:00.000Z',
            rotationNumber: 1,
            observations: 'Lote de novillos'
        });

        expect(result).toBeDefined();
        expect(result.paddockId).toBe(paddockId);
        expect(result.animalIds).toEqual([animalId1, animalId2]);
        expect(result.rotationNumber).toBe(1);
        expect(result.observations).toBe('Lote de novillos');
        expect(mockGrazingRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error when paddock is not found', async () => {
        mockPaddockRepo.findById.mockResolvedValue(null);

        await expect(useCase.execute({
            paddockId: 'non-existent-id',
            animalIds: [animalId1],
            entryDate: '2026-03-01T08:00:00.000Z',
            rotationNumber: 1
        })).rejects.toThrow('Paddock not found');

        expect(mockGrazingRepo.save).not.toHaveBeenCalled();
    });

    it('should throw error when paddock is in MAINTENANCE status', async () => {
        const paddockInMaintenance = new Paddock(paddockId, 'Potrero Mantenimiento', 30, 10, PaddockStatus.MAINTENANCE);
        mockPaddockRepo.findById.mockResolvedValue(paddockInMaintenance);

        await expect(useCase.execute({
            paddockId,
            animalIds: [animalId1],
            entryDate: '2026-03-01T08:00:00.000Z',
            rotationNumber: 1
        })).rejects.toThrow('Cannot register grazing activity for a paddock in MAINTENANCE status');

        expect(mockGrazingRepo.save).not.toHaveBeenCalled();
    });

    it('should throw error when entry date is invalid', async () => {
        const paddock = new Paddock(paddockId, 'Potrero 1', 30, 10, PaddockStatus.ACTIVE);
        mockPaddockRepo.findById.mockResolvedValue(paddock);

        await expect(useCase.execute({
            paddockId,
            animalIds: [animalId1],
            entryDate: 'invalid-date-string',
            rotationNumber: 1
        })).rejects.toThrow('Invalid entry date');

        expect(mockGrazingRepo.save).not.toHaveBeenCalled();
    });

    it('should throw error when exit date is earlier than entry date', async () => {
        const paddock = new Paddock(paddockId, 'Potrero 1', 30, 10, PaddockStatus.ACTIVE);
        mockPaddockRepo.findById.mockResolvedValue(paddock);

        await expect(useCase.execute({
            paddockId,
            animalIds: [animalId1],
            entryDate: '2026-03-05T08:00:00.000Z',
            exitDate: '2026-03-01T08:00:00.000Z',
            rotationNumber: 1
        })).rejects.toThrow('Exit date cannot be earlier than entry date');

        expect(mockGrazingRepo.save).not.toHaveBeenCalled();
    });
});
