import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListAppointmentsUseCase } from '@application/use-cases/Appointment/ListAppointmentsUseCase.js';
import { Appointment, AppointmentStatus } from '@domain/entities/Appointment.js';
import type { AppointmentRepository } from '@domain/repositories/AppointmentRepository.js';
import { randomUUID } from 'node:crypto';

describe('ListAppointmentsUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: ListAppointmentsUseCase;

    beforeEach(() => {
        mockRepo = {
            findAll: vi.fn(),
            findByAnimalId: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new ListAppointmentsUseCase(mockRepo as unknown as AppointmentRepository);
    });

    it('should list all appointments', async () => {
        const mockAppointments = [new Appointment(randomUUID(), randomUUID(), new Date(), 'R', AppointmentStatus.SCHEDULED, 'U')];
        (mockRepo.findAll as any).mockResolvedValue(mockAppointments);

        const result = await useCase.execute();

        expect(mockRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockAppointments);
    });

    it('should list appointments by animal id', async () => {
        const animalId = randomUUID();
        const mockAppointments = [new Appointment(randomUUID(), animalId, new Date(), 'R', AppointmentStatus.SCHEDULED, 'U')];
        (mockRepo.findByAnimalId as any).mockResolvedValue(mockAppointments);

        const result = await useCase.executeByAnimal(animalId);

        expect(mockRepo.findByAnimalId).toHaveBeenCalledWith(animalId);
        expect(result).toEqual(mockAppointments);
    });
});
