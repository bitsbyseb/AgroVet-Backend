import { randomUUID } from 'node:crypto';
import { AuditLog } from '../../../domain/entities/AuditLog.js';
export class RecordActivityUseCase {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async execute(request) {
        let detailsString = null;
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
