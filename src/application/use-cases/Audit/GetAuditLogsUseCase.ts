import { AuditLog } from '@domain/entities/AuditLog.js';
import type { AuditLogRepository, AuditLogFilters } from '@domain/repositories/AuditLogRepository.js';

export interface GetAuditLogsRequest {
    userId?: string;
    action?: string;
    resource?: string;
    from?: string; // ISO string
    to?: string;   // ISO string
    status?: string;
    limit?: number;
    offset?: number;
}

export interface GetAuditLogsResult {
    logs: AuditLog[];
    total: number;
    limit: number;
    offset: number;
}

export class GetAuditLogsUseCase {
    constructor(private readonly auditLogRepository: AuditLogRepository) {}

    async execute(request: GetAuditLogsRequest = {}): Promise<GetAuditLogsResult> {
        let startDate: Date | undefined = undefined;
        let endDate: Date | undefined = undefined;

        if (request.from) {
            startDate = new Date(request.from);
            startDate.setHours(0, 0, 0, 0);
        }

        if (request.to) {
            endDate = new Date(request.to);
            endDate.setHours(23, 59, 59, 999);
        }

        const limit = request.limit && request.limit > 0 ? Math.min(request.limit, 100) : 50;
        const offset = request.offset && request.offset >= 0 ? request.offset : 0;

        const filters: AuditLogFilters = {
            userId: request.userId,
            action: request.action,
            resource: request.resource,
            status: request.status,
            startDate,
            endDate,
            limit,
            offset
        };

        const [logs, total] = await Promise.all([
            this.auditLogRepository.findAll(filters),
            this.auditLogRepository.count(filters)
        ]);

        return {
            logs,
            total,
            limit,
            offset
        };
    }
}
