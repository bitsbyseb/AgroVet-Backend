import type { Alert, AlertModuleType, AlertStatus, AlertPriority } from '../entities/Alert.js';

/**
 * Puerto de Repositorio de Dominio para Alert.
 * Define el contrato de persistencia desacoplado de la infraestructura.
 */
export interface AlertRepository {
    /** Persiste una nueva alerta. */
    save(alert: Alert): Promise<void>;

    /** Busca una alerta por su identificador único. */
    findById(id: string): Promise<Alert | null>;

    /** Retorna todas las alertas asociadas a un animal específico. */
    findByAnimalId(animalId: string): Promise<Alert[]>;

    /** Retorna todas las alertas asociadas a un usuario específico. */
    findByUserId(userId: string): Promise<Alert[]>;

    /**
     * Retorna alertas filtradas por estado (pending / read).
     * Si userId se provee, filtra además por usuario.
     */
    findByStatus(status: AlertStatus, userId?: string): Promise<Alert[]>;

    /**
     * Retorna alertas filtradas por tipo de módulo.
     * Si animalId se provee, filtra además por animal.
     */
    findByModuleType(moduleType: AlertModuleType, animalId?: string): Promise<Alert[]>;

    /**
     * Retorna alertas cuya fecha de disparo sea <= a la fecha indicada
     * y que aún estén en estado 'pending'. Útil para el job de notificaciones.
     */
    findDueAlerts(asOf: Date): Promise<Alert[]>;

    /**
     * Retorna alertas con prioridad específica.
     * Útil para dashboards y reportes de criticidad.
     */
    findByPriority(priority: AlertPriority, userId?: string): Promise<Alert[]>;

    /** Retorna todas las alertas del sistema. */
    findAll(): Promise<Alert[]>;

    /** Actualiza una alerta existente. */
    update(alert: Alert): Promise<void>;

    /** Elimina una alerta por ID. */
    delete(id: string): Promise<void>;

    /** Marca todas las alertas pendientes de un usuario como leídas. */
    markAllAsReadByUser(userId: string): Promise<void>;
}
