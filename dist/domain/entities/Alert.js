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
    id;
    animalId;
    userId;
    moduleType;
    message;
    triggerDate;
    status;
    priority;
    emailSent;
    createdAt;
    updatedAt;
    constructor(id, animalId, userId, moduleType, message, triggerDate, status, priority, emailSent, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.userId = userId;
        this.moduleType = moduleType;
        this.message = message;
        this.triggerDate = triggerDate;
        this.status = status;
        this.priority = priority;
        this.emailSent = emailSent;
        if (!message || message.trim() === '') {
            throw new Error('Alert message cannot be empty.');
        }
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // ─── Getters de conveniencia ──────────────────────────────────────────────
    get isPending() {
        return this.status === 'pending';
    }
    get isRead() {
        return this.status === 'read';
    }
    get isHighPriority() {
        return this.priority === 'high';
    }
    get isDue() {
        return this.triggerDate <= new Date();
    }
    // ─── Comportamiento de dominio ────────────────────────────────────────────
    /**
     * Marca la alerta como leída.
     * Lanza error si ya estaba marcada como leída.
     */
    markAsRead() {
        if (this.status === 'read') {
            throw new Error('Alert is already marked as read.');
        }
        this.status = 'read';
    }
    /**
     * Actualiza el mensaje de la alerta.
     */
    updateMessage(newMessage) {
        if (!newMessage || newMessage.trim() === '') {
            throw new Error('Alert message cannot be empty.');
        }
        this.message = newMessage.trim();
    }
    /**
     * Cambia la prioridad de la alerta.
     */
    updatePriority(priority) {
        this.priority = priority;
    }
    /**
     * Reprograma la fecha de disparo de la alerta.
     */
    reschedule(newTriggerDate) {
        this.triggerDate = newTriggerDate;
    }
    /**
     * Registra que el correo electrónico de notificación fue enviado.
     */
    markEmailSent() {
        this.emailSent = true;
    }
    /**
     * Actualiza los campos editables de la alerta.
     */
    update(data) {
        if (data.message !== undefined)
            this.updateMessage(data.message);
        if (data.triggerDate !== undefined)
            this.triggerDate = data.triggerDate;
        if (data.status !== undefined)
            this.status = data.status;
        if (data.priority !== undefined)
            this.priority = data.priority;
        if (data.emailSent !== undefined)
            this.emailSent = data.emailSent;
    }
}
