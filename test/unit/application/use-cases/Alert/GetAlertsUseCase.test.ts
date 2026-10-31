import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAlertsUseCase } from '@application/use-cases/Alert/GetAlertsUseCase.js';
import type { AlertRepository } from '@domain/repositories/AlertRepository.js';
import { Alert } from '@domain/entities/Alert.js';
import { randomUUID } from 'node:crypto';

const makeAlert = (overrides: Partial<ConstructorParameters<typeof Alert>> = []) => {
    const [id, animalId, userId, moduleType, message, triggerDate, status, priority, emailSent] = [
        randomUUID(), randomUUID(), randomUUID(), 'vaccination', 'Vacuna vencida',
        new Date(), 'pending', 'high', false,
        ...(overrides as any[])
    ];
    return new Alert(id, animalId, userId, moduleType as any, message, triggerDate, status as any, priority as any, emailSent);
};

describe('GetAlertsUseCase (Sprint 18 - HU10/HU11)', () => {
    let mockAlertRepo: Partial<AlertRepository>;
    let useCase: GetAlertsUseCase;

    const sampleAlerts = [makeAlert(), makeAlert()];

    beforeEach(() => {
        mockAlertRepo = {
            findAll:         vi.fn().mockResolvedValue(sampleAlerts),
            findByUserId:    vi.fn().mockResolvedValue(sampleAlerts),
            findByAnimalId:  vi.fn().mockResolvedValue(sampleAlerts),
            findByStatus:    vi.fn().mockResolvedValue(sampleAlerts),
            findByPriority:  vi.fn().mockResolvedValue(sampleAlerts),
            findByModuleType:vi.fn().mockResolvedValue(sampleAlerts),
            findDueAlerts:   vi.fn().mockResolvedValue(sampleAlerts),
        };
        useCase = new GetAlertsUseCase(mockAlertRepo as AlertRepository);
    });

    it('debería retornar todas las alertas cuando no se aplican filtros', async () => {
        const result = await useCase.execute({});
        expect(mockAlertRepo.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(2);
    });

    it('debería filtrar por userId cuando se provee', async () => {
        const userId = randomUUID();
        await useCase.execute({ userId });
        expect(mockAlertRepo.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('debería filtrar por animalId cuando se provee', async () => {
        const animalId = randomUUID();
        await useCase.execute({ animalId });
        expect(mockAlertRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
    });

    it('debería filtrar por status', async () => {
        await useCase.execute({ status: 'pending' });
        expect(mockAlertRepo.findByStatus).toHaveBeenCalledWith('pending', undefined);
    });

    it('debería filtrar por prioridad', async () => {
        await useCase.execute({ priority: 'high' });
        expect(mockAlertRepo.findByPriority).toHaveBeenCalledWith('high', undefined);
    });

    it('debería filtrar por moduleType', async () => {
        await useCase.execute({ moduleType: 'vaccination' });
        expect(mockAlertRepo.findByModuleType).toHaveBeenCalledWith('vaccination', undefined);
    });

    it('debería usar findDueAlerts cuando onlyDue=true', async () => {
        await useCase.execute({ onlyDue: true });
        expect(mockAlertRepo.findDueAlerts).toHaveBeenCalled();
    });

    it('getPendingByUser debería retornar alertas pendientes del usuario', async () => {
        const userId = randomUUID();
        await useCase.getPendingByUser(userId);
        expect(mockAlertRepo.findByStatus).toHaveBeenCalledWith('pending', userId);
    });

    it('getPendingByUser debería lanzar error si userId está vacío', async () => {
        await expect(useCase.getPendingByUser('')).rejects.toThrow('userId is required');
    });
});
