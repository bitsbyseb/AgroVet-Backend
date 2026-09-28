import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetGrazingHistoryUseCase } from '@application/use-cases/paddocks/GetGrazingHistoryUseCase.js';
import { GrazingActivity } from '@domain/entities/GrazingActivity.js';
import type { GrazingActivityRepository, IGrazingFilters } from '@domain/repositories/GrazingActivityRepository.js';
import { randomUUID } from 'node:crypto';

describe('GetGrazingHistoryUseCase Unit Tests', () => {
    let mockGrazingRepo: {
        save: ReturnType<typeof vi.fn>;
        findById: ReturnType<typeof vi.fn>;
        findByPaddockId: ReturnType<typeof vi.fn>;
        findActiveByPaddockId: ReturnType<typeof vi.fn>;
        findByAnimalId: ReturnType<typeof vi.fn>;
        findHistory: ReturnType<typeof vi.fn>;
        findAll: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    let useCase: GetGrazingHistoryUseCase;

    const paddockId1 = randomUUID();
    const paddockId2 = randomUUID();
    const animalId1 = randomUUID();
    const animalId2 = randomUUID();

    beforeEach(() => {
        mockGrazingRepo = {
            save: vi.fn(),
            findById: vi.fn(),
            findByPaddockId: vi.fn(),
            findActiveByPaddockId: vi.fn(),
            findByAnimalId: vi.fn(),
            findHistory: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        useCase = new GetGrazingHistoryUseCase(
            mockGrazingRepo as unknown as GrazingActivityRepository
        );
    });

    it('should retrieve all grazing history and calculate permanenceTime when no filters are passed', async () => {
        const activity1 = new GrazingActivity(
            randomUUID(),
            paddockId1,
            [animalId1],
            new Date('2026-03-01T08:00:00Z'),
            new Date('2026-03-03T12:00:00Z'), // 2 days, 4 hours = 52 hours
            1,
            'Observación 1'
        );

        const activity2 = new GrazingActivity(
            randomUUID(),
            paddockId2,
            [animalId2],
            new Date('2026-03-05T08:00:00Z'),
            null, // En curso
            2,
            'Observación 2'
        );

        mockGrazingRepo.findHistory.mockResolvedValue([activity1, activity2]);

        const refDate = new Date('2026-03-06T14:00:00Z'); // 1 day, 6 hours = 30 hours
        const result = await useCase.execute({}, refDate);

        expect(mockGrazingRepo.findHistory).toHaveBeenCalledWith({});
        expect(result).toHaveLength(2);

        // Activity 1
        expect(result[0].id).toBe(activity1.id);
        expect(result[0].paddockId).toBe(paddockId1);
        expect(result[0].permanenceTime.inProgress).toBe(false);
        expect(result[0].permanenceTime.days).toBe(2);
        expect(result[0].permanenceTime.hours).toBe(4);
        expect(result[0].permanenceTime.totalHours).toBe(52);
        expect(result[0].permanenceTime.formatted).toBe('2 días, 4 horas');

        // Activity 2 (in progress)
        expect(result[1].id).toBe(activity2.id);
        expect(result[1].paddockId).toBe(paddockId2);
        expect(result[1].permanenceTime.inProgress).toBe(true);
        expect(result[1].permanenceTime.days).toBe(1);
        expect(result[1].permanenceTime.hours).toBe(6);
        expect(result[1].permanenceTime.totalHours).toBe(30);
        expect(result[1].permanenceTime.formatted).toBe('1 día, 6 horas (en curso)');
    });

    it('should forward filters to the repository findHistory method', async () => {
        const filters: IGrazingFilters = {
            paddockId: paddockId1,
            animalId: animalId1,
            startDate: new Date('2026-03-01T00:00:00Z'),
            endDate: new Date('2026-03-10T23:59:59Z')
        };

        mockGrazingRepo.findHistory.mockResolvedValue([]);

        const result = await useCase.execute(filters);

        expect(mockGrazingRepo.findHistory).toHaveBeenCalledWith(filters);
        expect(result).toEqual([]);
    });

    it('should calculate permanenceTime correctly when duration is less than 24 hours', async () => {
        const activity = new GrazingActivity(
            randomUUID(),
            paddockId1,
            [animalId1],
            new Date('2026-03-01T08:00:00Z'),
            new Date('2026-03-01T15:00:00Z'), // 7 hours
            1
        );

        mockGrazingRepo.findHistory.mockResolvedValue([activity]);

        const result = await useCase.execute();

        expect(result[0].permanenceTime.days).toBe(0);
        expect(result[0].permanenceTime.hours).toBe(7);
        expect(result[0].permanenceTime.totalHours).toBe(7);
        expect(result[0].permanenceTime.formatted).toBe('7 horas');
        expect(result[0].permanenceTime.inProgress).toBe(false);
    });

    it('should throw error when startDate is invalid', async () => {
        await expect(useCase.execute({
            startDate: 'invalid-date' as unknown as Date
        })).rejects.toThrow('Invalid startDate filter');
    });

    it('should throw error when endDate is invalid', async () => {
        await expect(useCase.execute({
            endDate: 'invalid-date' as unknown as Date
        })).rejects.toThrow('Invalid endDate filter');
    });

    it('should throw error when startDate is after endDate', async () => {
        await expect(useCase.execute({
            startDate: new Date('2026-03-15T00:00:00Z'),
            endDate: new Date('2026-03-10T00:00:00Z')
        })).rejects.toThrow('startDate cannot be after endDate');
    });
});
