import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarkAlertAsReadUseCase } from '@application/use-cases/Alert/MarkAlertAsReadUseCase.js';
import type { AlertRepository } from '@domain/repositories/AlertRepository.js';
import { Alert } from '@domain/entities/Alert.js';
import { randomUUID } from 'node:crypto';

const makePendingAlert = () =>
    new Alert(
        randomUUID(), randomUUID(), randomUUID(),
        'vaccination', 'Alerta de prueba',
        new Date(), 'pending', 'medium', false
    );

const makeReadAlert = () =>
    new Alert(
        randomUUID(), randomUUID(), randomUUID(),
        'control', 'Alerta ya leída',
        new Date(), 'read', 'low', false
    );

describe('MarkAlertAsReadUseCase (Sprint 18 - HU11)', () => {
    let mockAlertRepo: Partial<AlertRepository>;
    let useCase: MarkAlertAsReadUseCase;

    beforeEach(() => {
        mockAlertRepo = {
            findById:            vi.fn(),
            update:              vi.fn().mockResolvedValue(undefined),
            findByStatus:        vi.fn(),
            markAllAsReadByUser: vi.fn().mockResolvedValue(undefined),
        };
        useCase = new MarkAlertAsReadUseCase(mockAlertRepo as AlertRepository);
    });

    it('debería marcar una alerta pendiente como leída', async () => {
        const alert = makePendingAlert();
        (mockAlertRepo.findById as any).mockResolvedValue(alert);

        const result = await useCase.execute(alert.id);

        expect(result.status).toBe('read');
        expect(mockAlertRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'read' }));
    });

    it('debería lanzar error si la alerta no existe', async () => {
        (mockAlertRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute('id-inexistente'))
            .rejects.toThrow('Alert not found');
    });

    it('debería lanzar error si el alertId está vacío', async () => {
        await expect(useCase.execute('')).rejects.toThrow('Alert ID is required');
    });

    it('debería lanzar error si la alerta ya está marcada como leída', async () => {
        const readAlert = makeReadAlert();
        (mockAlertRepo.findById as any).mockResolvedValue(readAlert);

        await expect(useCase.execute(readAlert.id))
            .rejects.toThrow('Alert is already marked as read');
    });

    it('executeMarkAll debería marcar todas las alertas pendientes del usuario', async () => {
        const userId = randomUUID();
        const pendingAlerts = [makePendingAlert(), makePendingAlert(), makePendingAlert()];
        (mockAlertRepo.findByStatus as any).mockResolvedValue(pendingAlerts);

        const result = await useCase.executeMarkAll(userId);

        expect(result.marked).toBe(3);
        expect(mockAlertRepo.markAllAsReadByUser).toHaveBeenCalledWith(userId);
    });

    it('executeMarkAll debería lanzar error si userId está vacío', async () => {
        await expect(useCase.executeMarkAll('')).rejects.toThrow('userId is required');
    });

    it('executeMarkAll debería retornar 0 si no hay alertas pendientes', async () => {
        const userId = randomUUID();
        (mockAlertRepo.findByStatus as any).mockResolvedValue([]);

        const result = await useCase.executeMarkAll(userId);
        expect(result.marked).toBe(0);
    });
});
