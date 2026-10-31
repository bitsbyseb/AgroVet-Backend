import type { Alert } from '@domain/entities/Alert.js';
import type { AlertRepository } from '@domain/repositories/AlertRepository.js';

/**
 * CU: MarkAlertAsReadUseCase (Sprint 18 - HU11)
 *
 * Marca una alerta individual como leída o marca todas las alertas
 * pendientes de un usuario como leídas en una sola operación.
 */
export class MarkAlertAsReadUseCase {
    constructor(private readonly alertRepository: AlertRepository) {}

    /**
     * Marca una alerta específica como leída por su ID.
     * @throws Error si la alerta no existe o ya está marcada como leída.
     */
    async execute(alertId: string): Promise<Alert> {
        if (!alertId || alertId.trim() === '') {
            throw new Error('Alert ID is required.');
        }

        const alert = await this.alertRepository.findById(alertId);
        if (!alert) {
            throw new Error(`Alert not found: ${alertId}`);
        }

        // La entidad de dominio encapsula la regla: no se puede marcar leída dos veces
        alert.markAsRead();
        await this.alertRepository.update(alert);

        return alert;
    }

    /**
     * Marca TODAS las alertas pendientes de un usuario como leídas.
     * Útil para el botón "Marcar todo como leído".
     * @returns Cantidad de alertas marcadas.
     */
    async executeMarkAll(userId: string): Promise<{ marked: number }> {
        if (!userId || userId.trim() === '') {
            throw new Error('userId is required to mark all alerts as read.');
        }

        const pending = await this.alertRepository.findByStatus('pending', userId);
        await this.alertRepository.markAllAsReadByUser(userId);

        return { marked: pending.length };
    }
}
