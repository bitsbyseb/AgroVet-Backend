import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterPaddockUseCase } from '@application/use-cases/paddocks/RegisterPaddockUseCase.js';
import { GetPaddocksUseCase } from '@application/use-cases/paddocks/GetPaddocksUseCase.js';
import { UpdatePaddockUseCase } from '@application/use-cases/paddocks/UpdatePaddockUseCase.js';
import { Paddock, PaddockStatus } from '@domain/entities/Paddock.js';
import type { PaddockRepository } from '@domain/repositories/PaddockRepository.js';
import { randomUUID } from 'node:crypto';

describe('Paddock Use Cases & Entity Unit Tests', () => {
    let mockRepo: {
        save: ReturnType<typeof vi.fn>;
        findById: ReturnType<typeof vi.fn>;
        findByName: ReturnType<typeof vi.fn>;
        findAll: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockRepo = {
            save: vi.fn(),
            findById: vi.fn(),
            findByName: vi.fn(),
            findAll: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };
    });

    describe('Paddock Entity Business Rules', () => {
        it('should create paddock with valid data', () => {
            const paddock = new Paddock(randomUUID(), 'Potrero Norte', 20, 5.5, PaddockStatus.ACTIVE, 'Pasto estrella');
            expect(paddock.name).toBe('Potrero Norte');
            expect(paddock.capacity).toBe(20);
            expect(paddock.area).toBe(5.5);
            expect(paddock.status).toBe(PaddockStatus.ACTIVE);
        });

        it('should throw error when capacity is negative or not integer', () => {
            expect(() => new Paddock(randomUUID(), 'Potrero Invalido', -5)).toThrow('Paddock capacity must be a positive integer or zero');
        });

        it('should throw error when area is negative', () => {
            expect(() => new Paddock(randomUUID(), 'Potrero Invalido', 10, -2.5)).toThrow('Paddock area cannot be negative');
        });

        it('should update status and check capacity accommodation', () => {
            const paddock = new Paddock(randomUUID(), 'Potrero Sur', 10, 2.0, PaddockStatus.ACTIVE);
            expect(paddock.canAccommodate(8, 2)).toBe(true);
            expect(paddock.canAccommodate(8, 3)).toBe(false);
            expect(paddock.isCapacityExceeded(11)).toBe(true);

            paddock.changeStatus(PaddockStatus.MAINTENANCE);
            expect(paddock.canAccommodate(0, 1)).toBe(false);
        });
    });

    describe('RegisterPaddockUseCase', () => {
        it('should register a new paddock successfully', async () => {
            mockRepo.findByName.mockResolvedValue(null);
            const useCase = new RegisterPaddockUseCase(mockRepo as unknown as PaddockRepository);

            const payload = {
                id: randomUUID(),
                name: 'Potrero Central',
                capacity: 30,
                area: 12.5,
                status: PaddockStatus.ACTIVE,
                description: 'Zona de pastoreo rotativo'
            };

            await useCase.execute(payload);

            expect(mockRepo.findByName).toHaveBeenCalledWith('Potrero Central');
            expect(mockRepo.save).toHaveBeenCalled();
            const savedPaddock = mockRepo.save.mock.calls[0][0];
            expect(savedPaddock).toBeInstanceOf(Paddock);
            expect(savedPaddock.name).toBe('Potrero Central');
        });

        it('should throw error if paddock with the same name already exists', async () => {
            const existing = new Paddock(randomUUID(), 'Potrero Central', 20);
            mockRepo.findByName.mockResolvedValue(existing);
            const useCase = new RegisterPaddockUseCase(mockRepo as unknown as PaddockRepository);

            await expect(useCase.execute({
                id: randomUUID(),
                name: 'Potrero Central',
                capacity: 25
            })).rejects.toThrow('Paddock with name "Potrero Central" already exists');

            expect(mockRepo.save).not.toHaveBeenCalled();
        });
    });

    describe('GetPaddocksUseCase', () => {
        it('should return all paddocks', async () => {
            const paddockList = [
                new Paddock(randomUUID(), 'P1', 10),
                new Paddock(randomUUID(), 'P2', 15)
            ];
            mockRepo.findAll.mockResolvedValue(paddockList);
            const useCase = new GetPaddocksUseCase(mockRepo as unknown as PaddockRepository);

            const result = await useCase.execute();
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('P1');
        });

        it('should find paddock by id', async () => {
            const id = randomUUID();
            const paddock = new Paddock(id, 'P1', 10);
            mockRepo.findById.mockResolvedValue(paddock);
            const useCase = new GetPaddocksUseCase(mockRepo as unknown as PaddockRepository);

            const result = await useCase.getById(id);
            expect(result).toBe(paddock);
            expect(mockRepo.findById).toHaveBeenCalledWith(id);
        });
    });

    describe('UpdatePaddockUseCase', () => {
        it('should update paddock details successfully', async () => {
            const id = randomUUID();
            const existing = new Paddock(id, 'P1 Old', 10);
            mockRepo.findById.mockResolvedValue(existing);
            mockRepo.findByName.mockResolvedValue(null);

            const useCase = new UpdatePaddockUseCase(mockRepo as unknown as PaddockRepository);
            await useCase.execute(id, {
                name: 'P1 New',
                capacity: 20,
                status: PaddockStatus.RESTING
            });

            expect(mockRepo.update).toHaveBeenCalled();
            expect(existing.name).toBe('P1 New');
            expect(existing.capacity).toBe(20);
            expect(existing.status).toBe(PaddockStatus.RESTING);
        });

        it('should throw error when paddock is not found', async () => {
            mockRepo.findById.mockResolvedValue(null);
            const useCase = new UpdatePaddockUseCase(mockRepo as unknown as PaddockRepository);

            await expect(useCase.execute('invalid-id', { name: 'P New' })).rejects.toThrow('Paddock not found');
            expect(mockRepo.update).not.toHaveBeenCalled();
        });
    });
});
