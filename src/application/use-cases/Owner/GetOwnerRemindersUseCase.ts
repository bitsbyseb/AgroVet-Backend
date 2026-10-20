import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { VaccinationRepository } from '@domain/repositories/VaccinationRepository.js';
import type { AppointmentRepository } from '@domain/repositories/AppointmentRepository.js';
import type { AlimentationRepository } from '@domain/repositories/AlimentationRepository.js';
import { AppointmentStatus } from '@domain/entities/Appointment.js';
import type { Animal } from '@domain/entities/Animal.js';

export type ReminderCategory = 'vaccination' | 'appointment' | 'alimentation';

export interface OwnerReminderDTO {
    id: string;
    animalId: string;
    animalName: string;
    category: ReminderCategory;
    title: string;
    description: string;
    dueDate: string;
    status: string;
}

export interface GetOwnerRemindersFilters {
    animalId?: string;
}

/**
 * Caso de Uso (Sprint 16 - HU7 / ASIDGA-172 a ASIDGA-174):
 * Permite a un propietario autenticado consultar una lista unificada de recordatorios futuros y pendientes
 * para sus animales, agregando vacunas pendientes (nextDoseDate), citas programadas (appointments) y planes
 * de alimentación activos (start_date / end_date). Soportando además filtrado opcional por animalId.
 */
export class GetOwnerRemindersUseCase {
    constructor(
        private readonly ownerRepository: OwnerRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly vaccinationRepository: VaccinationRepository,
        private readonly appointmentRepository: AppointmentRepository,
        private readonly alimentationRepository: AlimentationRepository
    ) {}

    async execute(userId: string, filters?: GetOwnerRemindersFilters): Promise<OwnerReminderDTO[]> {
        // 1. Resolver el perfil de propietario vinculado al userId autenticado en el JWT
        const owner = await this.ownerRepository.findByUserId(userId);
        if (!owner) {
            throw new Error('No se encontró un perfil de propietario asociado a este usuario.');
        }

        // 2. Determinar los animales a consultar con validación estricta de pertenencia (ASIDGA-174)
        let targetAnimals: Animal[] = [];

        if (filters?.animalId && filters.animalId.trim() !== '') {
            const requestedAnimalId = filters.animalId.trim();
            const animal = await this.animalRepository.findById(requestedAnimalId);

            if (!animal) {
                throw new Error(`El animal con ID "${requestedAnimalId}" no fue encontrado.`);
            }

            if (animal.ownerId !== owner.id) {
                throw new Error('Acceso no autorizado: el animal solicitado no pertenece a este propietario.');
            }

            targetAnimals = [animal];
        } else {
            targetAnimals = await this.animalRepository.findByOwnerId(owner.id);
        }

        if (targetAnimals.length === 0) {
            return [];
        }

        const now = new Date();

        // 3. Consultar y unificar los recordatorios en paralelo por cada animal
        const reminderPromises = targetAnimals.map(async (animal) => {
            const [vaccinations, appointments, alimentations] = await Promise.all([
                this.vaccinationRepository.findByAnimalId(animal.id),
                this.appointmentRepository.findByAnimalId(animal.id),
                this.alimentationRepository.findByAnimalId(animal.id)
            ]);

            const animalReminders: OwnerReminderDTO[] = [];

            // A) Recordatorios de Vacunación (próxima dosis programada / next_dose_date)
            for (const vac of vaccinations) {
                if (vac.nextDoseDate) {
                    const dueDateObj = vac.nextDoseDate instanceof Date ? vac.nextDoseDate : new Date(vac.nextDoseDate);
                    const isOverdue = dueDateObj.getTime() < now.getTime();

                    animalReminders.push({
                        id: vac.id,
                        animalId: animal.id,
                        animalName: animal.name,
                        category: 'vaccination',
                        title: `Próxima dosis: ${vac.vaccineName}`,
                        description: `Dosis de refuerzo programada para ${vac.vaccineName}${vac.batchNumber ? ` (Lote: ${vac.batchNumber})` : ''}`,
                        dueDate: dueDateObj.toISOString(),
                        status: isOverdue ? 'overdue' : 'pending'
                    });
                }
            }

            // B) Recordatorios de Citas Médicas / Consultas (estado programado / scheduled)
            for (const app of appointments) {
                if (app.status === AppointmentStatus.SCHEDULED) {
                    const dueDateObj = app.date instanceof Date ? app.date : new Date(app.date);
                    const isOverdue = dueDateObj.getTime() < now.getTime();

                    animalReminders.push({
                        id: app.id,
                        animalId: animal.id,
                        animalName: animal.name,
                        category: 'appointment',
                        title: `Consulta veterinaria: ${app.reason}`,
                        description: `Cita médica programada por motivo: ${app.reason}`,
                        dueDate: dueDateObj.toISOString(),
                        status: isOverdue ? 'overdue' : 'scheduled'
                    });
                }
            }

            // C) Recordatorios de Alimentación (planes vigentes / fecha límite end_date)
            for (const alim of alimentations) {
                const endDateObj = alim.endDate instanceof Date ? alim.endDate : new Date(alim.endDate);
                const startDateObj = alim.startDate instanceof Date ? alim.startDate : new Date(alim.startDate);

                // Se considera recordatorio si el plan está en curso o finaliza a futuro/reciente
                if (endDateObj.getTime() >= now.getTime() || (now.getTime() - endDateObj.getTime() <= 7 * 24 * 60 * 60 * 1000)) {
                    animalReminders.push({
                        id: alim.id,
                        animalId: animal.id,
                        animalName: animal.name,
                        category: 'alimentation',
                        title: `Plan de dieta: ${alim.frequency}`,
                        description: `Suministro de ${alim.count} ${alim.unit} con frecuencia ${alim.frequency}. Vigencia: ${startDateObj.toLocaleDateString()} a ${endDateObj.toLocaleDateString()}.${alim.observations ? ` Obs: ${alim.observations}` : ''}`.trim(),
                        dueDate: endDateObj.toISOString(),
                        status: endDateObj.getTime() >= now.getTime() ? 'active' : 'completed'
                    });
                }
            }

            return animalReminders;
        });

        const nestedResults = await Promise.all(reminderPromises);
        const unifiedReminders = nestedResults.flat();

        // 4. Ordenar cronológicamente por dueDate ascendente (los más próximos o vencidos primero)
        unifiedReminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        return unifiedReminders;
    }
}
