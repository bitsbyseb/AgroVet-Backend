import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordActivityUseCase } from '@application/use-cases/Audit/RecordActivityUseCase.js';
import type { AuditLogRepository } from '@domain/repositories/AuditLogRepository.js';

describe('RecordActivityUseCase (HU18)', () => {
    let mockRepo: {
        save: ReturnType<typeof vi.fn>;
        findAll: ReturnType<typeof vi.fn>;
        count: ReturnType<typeof vi.fn>;
    };
    let useCase: RecordActivityUseCase;

    beforeEach(() => {
        mockRepo = {
            save: vi.fn().mockResolvedValue(undefined),
            findAll: vi.fn(),
            count: vi.fn()
        };
        useCase = new RecordActivityUseCase(mockRepo as unknown as AuditLogRepository);
    });

    it('should create and persist an audit log for user login', async () => {
        const result = await useCase.execute({
            userId: 'user-123',
            userEmail: 'vet@agrovet.com',
            userRole: 'veterinarian',
            action: 'LOGIN',
            resource: 'AUTH',
            details: { ip: '127.0.0.1' },
            status: 'SUCCESS'
        });

        expect(result.id).toBeDefined();
        expect(result.userId).toBe('user-123');
        expect(result.action).toBe('LOGIN');
        expect(result.resource).toBe('AUTH');
        expect(result.details).toContain('127.0.0.1');
        expect(result.status).toBe('SUCCESS');
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should serialize object details into JSON string', async () => {
        const detailsObj = { targetUser: 'user-456', newRole: 'administrator' };
        const result = await useCase.execute({
            userId: 'admin-1',
            action: 'ROLE_CHANGE',
            resource: 'USER',
            details: detailsObj
        });

        expect(result.details).toBe(JSON.stringify(detailsObj));
        expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
            action: 'ROLE_CHANGE',
            details: JSON.stringify(detailsObj)
        }));
    });
});
