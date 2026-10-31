/**
 * CU: GetAlertsUseCase (Sprint 18 - HU10/HU11)
 *
 * Consulta alertas del sistema según los filtros provistos.
 * Soporta filtrado por usuario, animal, estado, prioridad, módulo y vencimiento.
 */
export class GetAlertsUseCase {
    alertRepository;
    constructor(alertRepository) {
        this.alertRepository = alertRepository;
    }
    async execute(filters = {}) {
        const { userId, animalId, status, priority, moduleType, onlyDue } = filters;
        // Prioridad de filtros: combinamos el más específico disponible
        if (onlyDue) {
            return this.alertRepository.findDueAlerts(new Date());
        }
        if (moduleType) {
            return this.alertRepository.findByModuleType(moduleType, animalId);
        }
        if (priority) {
            return this.alertRepository.findByPriority(priority, userId);
        }
        if (status) {
            return this.alertRepository.findByStatus(status, userId);
        }
        if (animalId) {
            return this.alertRepository.findByAnimalId(animalId);
        }
        if (userId) {
            return this.alertRepository.findByUserId(userId);
        }
        return this.alertRepository.findAll();
    }
    /**
     * Shortcut: obtener todas las alertas pendientes de un usuario.
     */
    async getPendingByUser(userId) {
        if (!userId || userId.trim() === '') {
            throw new Error('userId is required to fetch pending alerts.');
        }
        return this.alertRepository.findByStatus('pending', userId);
    }
}
