/**
 * Tipos de módulo que pueden generar una alerta en el sistema AgroVet.
 */
export type AlertModuleType =
    | 'vaccination'
    | 'treatment'
    | 'control'
    | 'feeding'
    | 'reproduction'
    | 'production'
    | 'grazing';

/**
 * Estados posibles de una alerta.
 */
export type AlertStatus = 'pending' | 'read';

/**
 * Niveles de prioridad de una alerta.
 */
export type AlertPriority = 'low' | 'medium' | 'high';

/**
 * Entidad de Dominio: Alert (Alarma / Recordatorio).
 *
 * Representa una notificación generada automáticamente o manualmente
 * sobre un evento crítico de un animal en cualquiera de los módulos
 * productivos o clínicos del sistema.
 *
 * Reglas de negocio encapsuladas:
 * - Una alerta no puede marcarse como leída si ya lo está.
 * - La fecha de disparo no puede ser en el pasado al crear la alerta.
 * - El mensaje no puede estar vacío.
 */
export class Alert {
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    constructor(
        public readonly id: string,
        public readonly animalId: string,
        public readonly userId: string,
        public readonly moduleType: AlertModuleType,
        public message: string,
        public triggerDate: Date,
        public status: AlertStatus,
        public priority: AlertPriority,
        public emailSent: boolean,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        if (!message || message.trim() === '') {
            throw new Error('Alert message cannot be empty.');
        }
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ─── Getters de conveniencia ──────────────────────────────────────────────

    get isPending(): boolean {
        return this.status === 'pending';
    }

    get isRead(): boolean {
        return this.status === 'read';
    }

    get isHighPriority(): boolean {
        return this.priority === 'high';
    }

    get isDue(): boolean {
        return this.triggerDate <= new Date();
    }

    // ─── Comportamiento de dominio ────────────────────────────────────────────

    /**
     * Marca la alerta como leída.
     * Lanza error si ya estaba marcada como leída.
     */
    public markAsRead(): void {
        if (this.status === 'read') {
            throw new Error('Alert is already marked as read.');
        }
        this.status = 'read';
    }

    /**
     * Actualiza el mensaje de la alerta.
     */
    public updateMessage(newMessage: string): void {
        if (!newMessage || newMessage.trim() === '') {
            throw new Error('Alert message cannot be empty.');
        }
        this.message = newMessage.trim();
    }

    /**
     * Cambia la prioridad de la alerta.
     */
    public updatePriority(priority: AlertPriority): void {
        this.priority = priority;
    }

    /**
     * Reprograma la fecha de disparo de la alerta.
     */
    public reschedule(newTriggerDate: Date): void {
        this.triggerDate = newTriggerDate;
    }

    /**
     * Registra que el correo electrónico de notificación fue enviado.
     */
    public markEmailSent(): void {
        this.emailSent = true;
    }

    /**
     * Actualiza los campos editables de la alerta.
     */
    public update(data: {
        message?: string;
        triggerDate?: Date;
        status?: AlertStatus;
        priority?: AlertPriority;
        emailSent?: boolean;
    }): void {
        if (data.message !== undefined) this.updateMessage(data.message);
        if (data.triggerDate !== undefined) this.triggerDate = data.triggerDate;
        if (data.status !== undefined) this.status = data.status;
        if (data.priority !== undefined) this.priority = data.priority;
        if (data.emailSent !== undefined) this.emailSent = data.emailSent;
    }
}
