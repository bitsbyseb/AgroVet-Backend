import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GrazingHistoryController } from '@infrastructure/http/hono/controllers/grazingHistoryController.js';
import { GetGrazingHistoryUseCase } from '@application/use-cases/paddocks/GetGrazingHistoryUseCase.js';
import { grazingHistoryQuerySchema } from '@infrastructure/http/hono/validators/grazingHistoryValidator.js';
import { randomUUID } from 'node:crypto';

describe('GrazingHistoryController Unit Tests', () => {
    let mockUseCase: {
        execute: ReturnType<typeof vi.fn>;
    };
    let controller: GrazingHistoryController;

    beforeEach(() => {
        mockUseCase = {
            execute: vi.fn()
        };
        controller = new GrazingHistoryController(
            mockUseCase as unknown as GetGrazingHistoryUseCase
        );
    });

    it('should successfully return grazing history with 200 status', async () => {
        const mockResult = [
            {
                id: randomUUID(),
                paddockId: randomUUID(),
                animalIds: [randomUUID()],
                entryDate: new Date('2026-03-01T08:00:00Z'),
                exitDate: new Date('2026-03-03T12:00:00Z'),
                rotationNumber: 1,
                observations: 'Buen forraje',
                permanenceTime: {
                    days: 2,
                    hours: 4,
                    totalHours: 52,
                    inProgress: false,
                    formatted: '2 días, 4 horas'
                }
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockResult);

        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({}),
                query: vi.fn()
            },
            json: vi.fn().mockImplementation((data, status) => ({ data, status }))
        };

        const response = await controller.getHistory(mockContext);

        expect(mockUseCase.execute).toHaveBeenCalledWith({});
        expect(mockContext.json).toHaveBeenCalledWith(mockResult, 200);
        expect(response).toEqual({ data: mockResult, status: 200 });
    });

    it('should pass query filters from c.req.valid to the use case', async () => {
        const filters = {
            animalId: randomUUID(),
            paddockId: randomUUID(),
            startDate: '2026-03-01T00:00:00.000Z',
            endDate: '2026-03-10T23:59:59.000Z'
        };

        mockUseCase.execute.mockResolvedValue([]);

        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue(filters),
                query: vi.fn()
            },
            json: vi.fn().mockImplementation((data, status) => ({ data, status }))
        };

        await controller.getHistory(mockContext);

        expect(mockUseCase.execute).toHaveBeenCalledWith(filters);
        expect(mockContext.json).toHaveBeenCalledWith([], 200);
    });

    it('should return 400 when use case throws a date validation error', async () => {
        mockUseCase.execute.mockRejectedValue(new Error('startDate cannot be after endDate'));

        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({}),
                query: vi.fn()
            },
            json: vi.fn().mockImplementation((data, status) => ({ data, status }))
        };

        const response = await controller.getHistory(mockContext);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'startDate cannot be after endDate' },
            400
        );
        expect(response).toEqual({
            data: { error: 'startDate cannot be after endDate' },
            status: 400
        });
    });

    it('should return 500 when use case throws an unexpected error', async () => {
        mockUseCase.execute.mockRejectedValue(new Error('Database connection failed'));

        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({}),
                query: vi.fn()
            },
            json: vi.fn().mockImplementation((data, status) => ({ data, status }))
        };

        const response = await controller.getHistory(mockContext);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'Database connection failed' },
            500
        );
        expect(response).toEqual({
            data: { error: 'Database connection failed' },
            status: 500
        });
    });
});

describe('grazingHistoryValidator Unit Tests', () => {
    it('should successfully parse valid query parameters', () => {
        const validParams = {
            animalId: randomUUID(),
            paddockId: randomUUID(),
            startDate: '2026-03-01T00:00:00.000Z',
            endDate: '2026-03-10T23:59:59.000Z'
        };

        const result = grazingHistoryQuerySchema.safeParse(validParams);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.animalId).toBe(validParams.animalId);
            expect(result.data.paddockId).toBe(validParams.paddockId);
            expect(result.data.startDate).toBe(validParams.startDate);
            expect(result.data.endDate).toBe(validParams.endDate);
        }
    });

    it('should allow empty query parameters (all are optional)', () => {
        const result = grazingHistoryQuerySchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it('should reject invalid UUID for animalId', () => {
        const invalidParams = {
            animalId: 'not-a-valid-uuid'
        };

        const result = grazingHistoryQuerySchema.safeParse(invalidParams);
        expect(result.success).toBe(false);
    });

    it('should reject invalid UUID for paddockId', () => {
        const invalidParams = {
            paddockId: '12345'
        };

        const result = grazingHistoryQuerySchema.safeParse(invalidParams);
        expect(result.success).toBe(false);
    });

    it('should reject invalid date strings for startDate and endDate', () => {
        const invalidStart = grazingHistoryQuerySchema.safeParse({
            startDate: 'invalid-iso-date'
        });
        expect(invalidStart.success).toBe(false);

        const invalidEnd = grazingHistoryQuerySchema.safeParse({
            endDate: 'invalid-iso-date'
        });
        expect(invalidEnd.success).toBe(false);
    });
});
