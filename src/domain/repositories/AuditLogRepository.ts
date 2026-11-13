import { AuditLog } from '../entities/AuditLog.js';

export interface AuditLogFilters {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    limit?: number;
    offset?: number;
}

export interface AuditLogRepository {
    save(auditLog: AuditLog): Promise<void>;
    findAll(filters?: AuditLogFilters): Promise<AuditLog[]>;
    count(filters?: AuditLogFilters): Promise<number>;
}
