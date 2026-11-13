import { AuditLog as AuditLogEntity } from '@domain/entities/AuditLog.js';
import type { AuditLogRepository, AuditLogFilters } from '@domain/repositories/AuditLogRepository.js';
import { AuditLog as AuditLogModel } from '../models/AuditLog.model.js';
import { Op } from '@sequelize/core';

export class SequelizeAuditLogRepository implements AuditLogRepository {
    async save(auditLog: AuditLogEntity): Promise<void> {
        await AuditLogModel.create({
            id: auditLog.id,
            userId: auditLog.userId,
            userEmail: auditLog.userEmail,
            userRole: auditLog.userRole,
            action: auditLog.action,
            resource: auditLog.resource,
            resourceId: auditLog.resourceId,
            details: auditLog.details,
            ipAddress: auditLog.ipAddress,
            status: auditLog.status,
            createdAt: auditLog.createdAt
        });
    }

    async findAll(filters: AuditLogFilters = {}): Promise<AuditLogEntity[]> {
        const where = this.buildWhereClause(filters);
        const limit = filters.limit ?? 50;
        const offset = filters.offset ?? 0;

        const models = await AuditLogModel.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return models.map((m) => this.toDomain(m));
    }

    async count(filters: AuditLogFilters = {}): Promise<number> {
        const where = this.buildWhereClause(filters);
        return await AuditLogModel.count({ where });
    }

    private buildWhereClause(filters: AuditLogFilters): Record<string, any> {
        const where: Record<string, any> = {};

        if (filters.userId && filters.userId.trim() !== '') {
            where.userId = filters.userId;
        }

        if (filters.action && filters.action.trim() !== '') {
            where.action = filters.action;
        }

        if (filters.resource && filters.resource.trim() !== '') {
            where.resource = filters.resource;
        }

        if (filters.status && filters.status.trim() !== '') {
            where.status = filters.status;
        }

        if (filters.startDate && filters.endDate) {
            where.createdAt = {
                [Op.between]: [filters.startDate, filters.endDate]
            };
        } else if (filters.startDate) {
            where.createdAt = {
                [Op.gte]: filters.startDate
            };
        } else if (filters.endDate) {
            where.createdAt = {
                [Op.lte]: filters.endDate
            };
        }

        return where;
    }

    private toDomain(model: AuditLogModel): AuditLogEntity {
        return new AuditLogEntity({
            id: model.id,
            userId: model.userId,
            userEmail: model.userEmail,
            userRole: model.userRole,
            action: model.action,
            resource: model.resource,
            resourceId: model.resourceId,
            details: model.details,
            ipAddress: model.ipAddress,
            status: model.status as any,
            createdAt: model.createdAt
        });
    }
}
