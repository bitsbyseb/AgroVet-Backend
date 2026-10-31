import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GenerateAlertsUseCase } from '@application/use-cases/Alert/GenerateAlertsUseCase.js';
import type { AlertRepository } from '@domain/repositories/AlertRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { VaccinationRepository } from '@domain/repositories/VaccinationRepository.js';
import type { EmailService } from '@domain/services/EmailService.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import { Vaccination } from '@domain/entities/Vaccination.js';
import { randomUUID } from 'node:crypto';

describe('GenerateAlertsUseCase (Sprint 18 - HU10)', () => {
    let mockAlertRepo: Partial<AlertRepository>;
    let mockAnimalRepo: Pick<AnimalRepository, 'findById'>;
    let mockVaccinationRepo: Pick<VaccinationRepository, 'findByAnimalId'>;
    let mockEmailService: EmailService;
    let useCase: GenerateAlertsUseCase;

    const animalId = randomUUID();
    const userId   = randomUUID();

    const mockAnimal = new Animal(
        animalId, 'Bella', speciesType.BOVINE, animalType.RURAL,
        'Holstein', Gender.FEMALE, new Date('2020-01-01'),
        Status.ACTIVE, 'Blanco/Negro', randomUUID()
    );

    beforeEach(() => {
        mockAlertRepo = {
            save:   vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockResolvedValue(undefined),
        };
        mockAnimalRepo = {
            findById: vi.fn().mockResolvedValue(mockAnimal)
        };
        mockVaccinationRepo = {
            findByAnimalId: vi.fn().mockResolvedValue([])
        };
        mockEmailService = {
            send: vi.fn().mockResolvedValue(undefined)
        };

        useCase = new GenerateAlertsUseCase(
            mockAlertRepo as AlertRepository,
            mockAnimalRepo as AnimalRepository,
            mockVaccinationRepo as VaccinationRepository,
            mockEmailService
        );
    });

    it('debería retornar 0 alertas cuando no hay vacunas registradas', async () => {
        const result = await useCase.execute({ animalId, userId });

        expect(result.generated).toBe(0);
        expect(result.alerts).toHaveLength(0);
        expect(mockAlertRepo.save).not.toHaveBeenCalled();
    });

    it('debería generar alerta de prioridad HIGH y enviar email cuando vacuna está vencida', async () => {
        const overdueDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 días atrás
        const vax = new Vaccination(
            randomUUID(), animalId, 'Rabia', new Date(), overdueDate, 'LOTE-001', userId
        );
        (mockVaccinationRepo.findByAnimalId as any).mockResolvedValue([vax]);

        const result = await useCase.execute({ animalId, userId });

        // Debe generar: 1 por vacuna vencida (high) + 1 de control (ninguna dosis futura)
        expect(result.generated).toBeGreaterThanOrEqual(1);
        const highAlert = result.alerts.find(a => a.priority === 'high');
        expect(highAlert).toBeDefined();
        expect(highAlert?.moduleType).toBe('vaccination');
        expect(highAlert?.status).toBe('pending');
        expect(mockEmailService.send).toHaveBeenCalledTimes(1);
    });

    it('debería generar alerta de prioridad MEDIUM cuando vacuna vence dentro del umbral', async () => {
        const soonDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 días
        const vax = new Vaccination(
            randomUUID(), animalId, 'Aftosa', new Date(), soonDate, 'LOTE-002', userId
        );
        (mockVaccinationRepo.findByAnimalId as any).mockResolvedValue([vax]);

        const result = await useCase.execute({ animalId, userId, daysAhead: 7 });

        const mediumAlert = result.alerts.find(a => a.priority === 'medium' && a.moduleType === 'vaccination');
        expect(mediumAlert).toBeDefined();
        expect(mockEmailService.send).not.toHaveBeenCalled();
    });

    it('debería generar alerta de CONTROL si ninguna vacuna tiene dosis futura programada', async () => {
        const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        const vax = new Vaccination(
            randomUUID(), animalId, 'Brucelosis', new Date(), pastDate, 'LOTE-003', userId
        );
        (mockVaccinationRepo.findByAnimalId as any).mockResolvedValue([vax]);

        const result = await useCase.execute({ animalId, userId });

        const controlAlert = result.alerts.find(a => a.moduleType === 'control');
        expect(controlAlert).toBeDefined();
        expect(controlAlert?.priority).toBe('medium');
    });

    it('debería generar alerta de TREATMENT cuando vacuna no tiene número de lote', async () => {
        const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        const vax = new Vaccination(
            randomUUID(), animalId, 'Antrax', new Date(), futureDate, null, userId
        );
        (mockVaccinationRepo.findByAnimalId as any).mockResolvedValue([vax]);

        const result = await useCase.execute({ animalId, userId });

        const treatmentAlert = result.alerts.find(a => a.moduleType === 'treatment');
        expect(treatmentAlert).toBeDefined();
        expect(treatmentAlert?.priority).toBe('low');
    });

    it('debería lanzar error si el animal no existe', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({ animalId: 'no-existe', userId }))
            .rejects.toThrow('Animal not found');

        expect(mockAlertRepo.save).not.toHaveBeenCalled();
    });

    it('no debería fallar aunque el envío de email falle', async () => {
        const overdueDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
        const vax = new Vaccination(
            randomUUID(), animalId, 'Rabia', new Date(), overdueDate, 'LOTE-X', userId
        );
        (mockVaccinationRepo.findByAnimalId as any).mockResolvedValue([vax]);
        (mockEmailService.send as any).mockRejectedValue(new Error('SMTP error'));

        // No debe propagar el error del email
        await expect(useCase.execute({ animalId, userId })).resolves.toBeDefined();
    });
});
