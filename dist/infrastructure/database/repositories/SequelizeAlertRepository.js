import { Op } from '@sequelize/core';
import { Alert as AlertEntity } from '../../../domain/entities/Alert.js';
import { Alert as AlertModel } from '../models/Alert.model.js';
import { cleanWhereClause } from '../utils/whereHelper.js';
export class SequelizeAlertRepository {
    // ─── Escritura ────────────────────────────────────────────────────────────
    async save(alert) {
        await AlertModel.create(this.toPersistence(alert));
    }
    async update(alert) {
        if (!alert.id || alert.id.trim() === '')
            return;
        const { id, ...dataToUpdate } = this.toPersistence(alert);
        await AlertModel.update(dataToUpdate, {
            where: cleanWhereClause({ id: alert.id })
        });
    }
    async delete(id) {
        if (!id || id.trim() === '')
            return;
        await AlertModel.destroy({
            where: cleanWhereClause({ id })
        });
    }
    async markAllAsReadByUser(userId) {
        if (!userId || userId.trim() === '')
            return;
        await AlertModel.update({ status: 'read' }, { where: cleanWhereClause({ userId, status: 'pending' }) });
    }
    // ─── Consulta ─────────────────────────────────────────────────────────────
    async findById(id) {
        if (!id || id.trim() === '')
            return null;
        const model = await AlertModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findAll() {
        const models = await AlertModel.findAll({
            order: [['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    async findByAnimalId(animalId) {
        if (!animalId || animalId.trim() === '')
            return [];
        const models = await AlertModel.findAll({
            where: cleanWhereClause({ animalId }),
            order: [['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    async findByUserId(userId) {
        if (!userId || userId.trim() === '')
            return [];
        const models = await AlertModel.findAll({
            where: cleanWhereClause({ userId }),
            order: [['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    async findByStatus(status, userId) {
        const whereClause = { status };
        if (userId && userId.trim() !== '')
            whereClause.userId = userId;
        const models = await AlertModel.findAll({
            where: cleanWhereClause(whereClause),
            order: [['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    async findByModuleType(moduleType, animalId) {
        const whereClause = { moduleType };
        if (animalId && animalId.trim() !== '')
            whereClause.animalId = animalId;
        const models = await AlertModel.findAll({
            where: cleanWhereClause(whereClause),
            order: [['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    async findDueAlerts(asOf) {
        const models = await AlertModel.findAll({
            where: {
                status: 'pending',
                triggerDate: { [Op.lte]: asOf }
            },
            order: [['priority', 'DESC'], ['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    async findByPriority(priority, userId) {
        const whereClause = { priority };
        if (userId && userId.trim() !== '')
            whereClause.userId = userId;
        const models = await AlertModel.findAll({
            where: cleanWhereClause(whereClause),
            order: [['triggerDate', 'ASC']]
        });
        return models.map((m) => this.toDomain(m));
    }
    // ─── Mappers ──────────────────────────────────────────────────────────────
    /**
     * Mapper de Entidad de Dominio → atributos de persistencia Sequelize.
     */
    toPersistence(entity) {
        return {
            id: entity.id,
            animalId: entity.animalId,
            userId: entity.userId,
            moduleType: entity.moduleType,
            message: entity.message,
            triggerDate: entity.triggerDate,
            status: entity.status,
            priority: entity.priority,
            emailSent: entity.emailSent
        };
    }
    /**
     * Mapper de Modelo Sequelize → Entidad de Dominio.
     */
    toDomain(model) {
        return new AlertEntity(model.id, model.animalId, model.userId, model.moduleType, model.message, model.triggerDate, model.status, model.priority, model.emailSent, model.createdAt, model.updatedAt);
    }
}
