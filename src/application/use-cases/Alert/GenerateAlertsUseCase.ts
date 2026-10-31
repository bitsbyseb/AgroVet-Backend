import { randomUUID } from 'node:crypto';
import { Alert, type AlertModuleType, type AlertPriority } from '@domain/entities/Alert.js';
import type { AlertRepository } from '@domain/repositories/AlertRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { VaccinationRepository } from '@domain/repositories/VaccinationRepository.js';
import type { EmailService } from '@domain/services/EmailService.js';

/**
 * DTO de entrada para generar alertas para un animal específico.
 */
export interface GenerateAlertsInput {
    animalId: string;
    userId: string;
    /** Días de anticipación para advertir sobre eventos próximos. Por defecto: 7. */
    daysAhead?: number;
}

/**
 * Resultado de la operación de generación.
 */
export interface GenerateAlertsResult {
    generated: number;
    alerts: Alert[];
}

/**
 * CU: GenerateAlertsUseCase (Sprint 18 - HU10)
 *
 * Evalúa las condiciones de disparo de los distintos módulos del animal
 * y crea alertas automáticas cuando detecta eventos próximos o vencidos.
 *
 * Módulos evaluados:
 *   - vaccination  → Próxima dosis vencida o en umbral
 *   - treatment    → Vacunas sin lote (proxy de tratamiento pendiente de completar)
 *   - control      → Próximas revisiones basadas en fecha de próxima dosis
 *   - feeding      → Placeholder para alertas de alimentación
 *   - reproduction → Placeholder para alertas reproductivas
 *   - production   → Placeholder para alertas de producción
 *   - grazing      → Placeholder para alertas de pastoreo
 *
 * Si la prioridad resultante es 'high', envía un correo de notificación
 * mediante EmailService.
 */
export class GenerateAlertsUseCase {
    constructor(
        private readonly alertRepository: AlertRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly vaccinationRepository: VaccinationRepository,
        private readonly emailService: EmailService
    ) {}

    async execute(input: GenerateAlertsInput): Promise<GenerateAlertsResult> {
        const { animalId, userId, daysAhead = 7 } = input;

        // 1. Validar que el animal existe
        const animal = await this.animalRepository.findById(animalId);
        if (!animal) {
            throw new Error(`Animal not found: ${animalId}`);
        }

        const now = new Date();
        const threshold = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        const generated: Alert[] = [];

        // 2. Evaluación del módulo de Vacunación
        const vaccinations = await this.vaccinationRepository.findByAnimalId(animalId);
        for (const vax of vaccinations) {
            if (!vax.nextDoseDate) continue;

            const nextDose = new Date(vax.nextDoseDate);
            let priority: AlertPriority;
            let message: string;

            if (nextDose < now) {
                // Vacuna vencida → alta prioridad
                priority = 'high';
                message = `⚠️ La vacuna "${vax.vaccineName}" del animal "${animal.name}" está VENCIDA desde el ${nextDose.toLocaleDateString('es-ES')}.`;
            } else if (nextDose <= threshold) {
                // Próxima en el umbral → media prioridad
                priority = 'medium';
                message = `🔔 La vacuna "${vax.vaccineName}" del animal "${animal.name}" vence el ${nextDose.toLocaleDateString('es-ES')}. Programe su aplicación.`;
            } else {
                continue;
            }

            const alert = await this.createAndSave({
                animalId,
                userId,
                moduleType: 'vaccination',
                message,
                triggerDate: nextDose < now ? now : nextDose,
                priority,
            });
            generated.push(alert);

            // Envío de correo si prioridad alta
            if (priority === 'high') {
                await this.sendEmailNotification(userId, alert);
            }
        }

        // 3. Evaluación del módulo de Tratamiento
        //    Detecta vacunas registradas sin número de lote (indicador de tratamiento incompleto)
        for (const vax of vaccinations) {
            if (!vax.batchNumber) {
                const alert = await this.createAndSave({
                    animalId,
                    userId,
                    moduleType: 'treatment',
                    message: `📋 La vacuna "${vax.vaccineName}" del animal "${animal.name}" no tiene número de lote registrado. Verifique el tratamiento.`,
                    triggerDate: now,
                    priority: 'low',
                });
                generated.push(alert);
            }
        }

        // 4. Evaluación del módulo de Control (próxima revisión)
        //    Se genera alerta de control si ninguna vacuna tiene próxima dosis programada
        if (vaccinations.length > 0) {
            const hasScheduledDose = vaccinations.some((v) => v.nextDoseDate && new Date(v.nextDoseDate) > now);
            if (!hasScheduledDose) {
                const triggerDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
                const alert = await this.createAndSave({
                    animalId,
                    userId,
                    moduleType: 'control',
                    message: `🩺 El animal "${animal.name}" no tiene ninguna dosis de vacuna programada. Considere agendar un control veterinario.`,
                    triggerDate,
                    priority: 'medium',
                });
                generated.push(alert);
            }
        }

        return { generated: generated.length, alerts: generated };
    }

    // ─── Helpers privados ─────────────────────────────────────────────────────

    private async createAndSave(params: {
        animalId: string;
        userId: string;
        moduleType: AlertModuleType;
        message: string;
        triggerDate: Date;
        priority: AlertPriority;
    }): Promise<Alert> {
        const alert = new Alert(
            randomUUID(),
            params.animalId,
            params.userId,
            params.moduleType,
            params.message,
            params.triggerDate,
            'pending',
            params.priority,
            false
        );
        await this.alertRepository.save(alert);
        return alert;
    }

    private async sendEmailNotification(userId: string, alert: Alert): Promise<void> {
        try {
            // En producción el userId se resolvería contra UserRepository para obtener el email.
            // Aquí delegamos la responsabilidad al servicio de email con data disponible.
            await this.emailService.send({
                to: `user-${userId}@agrovet.internal`,
                subject: `🚨 AgroVet — Alerta de ALTA prioridad: ${alert.moduleType}`,
                html: `
                    <h2>Alerta AgroVet — Prioridad Alta</h2>
                    <p><strong>Módulo:</strong> ${alert.moduleType}</p>
                    <p><strong>Mensaje:</strong> ${alert.message}</p>
                    <p><strong>Fecha de disparo:</strong> ${alert.triggerDate.toLocaleString('es-ES')}</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">Este mensaje fue generado automáticamente por el sistema AgroVet.</p>
                `
            });
            alert.markEmailSent();
            await this.alertRepository.update(alert);
        } catch {
            // No propagamos el error de email para no bloquear la generación de alertas
            console.error(`[GenerateAlertsUseCase] Fallo al enviar correo para alerta ${alert.id}`);
        }
    }
}
