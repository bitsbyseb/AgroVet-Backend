import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAuditLogsUseCase } from '@application/use-cases/Audit/GetAuditLogsUseCase.js';
import { AuditLog } from '@domain/entities/AuditLog.js';
import type { AuditLogRepository } from '@domain/repositories/AuditLogRepository.js';

describe('GetAuditLogsUseCase (HU19)', () => {
    let mockRepo: {
        save: ReturnType<typeof vi.fn>;
        findAll: ReturnType<typeof vi.fn>;
        count: ReturnType<typeof vi.fn>;
    };
    let useCase: GetAuditLogsUseCase;

    const mockLogs: AuditLog[] = [
        new AuditLog({
            id: 'log-1',
            userId: 'user-1',
            userEmail: 'admin@agrovet.com',
            userRole: 'administrator',
            action: 'LOGIN',
            resource: 'AUTH',
            status: 'SUCCESS',
            createdAt: new Date('2026-11-01T10:00:00Z')
        }),
        new AuditLog({
            id: 'log-2',
            userId: 'user-2',
            userEmail: 'vet@agrovet.com',
            userRole: 'veterinarian',
            action: 'CREATE',
            resource: 'ANIMAL',
            resourceId: 'animal-99',
            status: 'SUCCESS',
            createdAt: new Date('2026-11-05T14:30:00Z')
        })
    ];

    beforeEach(() => {
        mockRepo = {
            save: vi.fn(),
            findAll: vi.fn().mockResolvedValue(mockLogs),
            count: vi.fn().mockResolvedValue(2)
        };
        useCase = new GetAuditLogsUseCase(mockRepo as unknown as AuditLogRepository);
    });

    it('should return paginated audit logs and total count', async () => {
        const result = await useCase.execute({ limit: 10, offset: 0 });

        expect(result.logs).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.limit).toBe(10);
        expect(result.offset).toBe(0);
        expect(mockRepo.findAll).toHaveBeenCalledWith(expect.objectContaining({
            limit: 10,
            offset: 0
        }));
    });

    it('should convert from and to strings into Date objects with correct boundaries', async () => {
        await useCase.execute({
            userId: 'user-1',
            from: '2026-11-01',
            to: '2026-11-05'
        });

        expect(mockRepo.findAll).toHaveBeenCalledWith(expect.objectContaining({
            userId: 'user-1',
            startDate: expect.any(Date),
            endDate: expect.any(Date)
        }));
    });
});
