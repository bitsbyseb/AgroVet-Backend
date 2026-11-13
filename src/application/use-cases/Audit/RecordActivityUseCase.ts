import { randomUUID } from 'node:crypto';
import { AuditLog, type AuditAction, type AuditStatus } from '@domain/entities/AuditLog.js';
import type { AuditLogRepository } from '@domain/repositories/AuditLogRepository.js';

export interface RecordActivityRequest {
    userId?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
    action: AuditAction | string;
    resource: string;
    resourceId?: string | null;
    details?: string | Record<string, any> | null;
    ipAddress?: string | null;
    status?: AuditStatus;
}

export class RecordActivityUseCase {
    constructor(private readonly auditLogRepository: AuditLogRepository) {}

    async execute(request: RecordActivityRequest): Promise<AuditLog> {
        let detailsString: string | null = null;
        if (request.details) {
            detailsString = typeof request.details === 'string' 
                ? request.details 
                : JSON.stringify(request.details);
        }

        const log = new AuditLog({
            id: randomUUID(),
            userId: request.userId ?? null,
            userEmail: request.userEmail ?? null,
            userRole: request.userRole ?? null,
            action: request.action,
            resource: request.resource,
            resourceId: request.resourceId ?? null,
            details: detailsString,
            ipAddress: request.ipAddress ?? null,
            status: request.status ?? 'SUCCESS',
            createdAt: new Date()
        });

        await this.auditLogRepository.save(log);
        return log;
    }
}
