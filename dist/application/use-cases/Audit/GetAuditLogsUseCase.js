import { AuditLog } from '../../../domain/entities/AuditLog.js';
export class GetAuditLogsUseCase {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async execute(request = {}) {
        let startDate = undefined;
        let endDate = undefined;
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
        const filters = {
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
