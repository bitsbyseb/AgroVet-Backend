import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateAppointmentUseCase } from '@application/use-cases/Appointment/UpdateAppointmentUseCase.js';
import { Appointment, AppointmentStatus } from '@domain/entities/Appointment.js';
import type { AppointmentRepository } from '@domain/repositories/AppointmentRepository.js';
import { randomUUID } from 'node:crypto';

describe('UpdateAppointmentUseCase', () => {
    let mockRepo: ReturnType<typeof vi.fn>;
    let useCase: UpdateAppointmentUseCase;

    beforeEach(() => {
        mockRepo = {
            findById: vi.fn(),
            update: vi.fn()
        } as unknown as ReturnType<typeof vi.fn>;
        useCase = new UpdateAppointmentUseCase(mockRepo as unknown as AppointmentRepository);
    });

    it('should update an appointment successfully', async () => {
        const id = randomUUID();
        const mockAppt = new Appointment(id, randomUUID(), new Date(), 'R', AppointmentStatus.SCHEDULED, 'U');
        (mockRepo.findById as any).mockResolvedValue(mockAppt);

        await useCase.execute(id, { reason: 'New Reason', status: AppointmentStatus.COMPLETED });

        expect(mockRepo.findById).toHaveBeenCalledWith(id);
        expect(mockRepo.update).toHaveBeenCalledWith(mockAppt);
        expect(mockAppt.reason).toBe('New Reason');
        expect(mockAppt.status).toBe(AppointmentStatus.COMPLETED);
    });

    it('should throw error if appointment not found', async () => {
        (mockRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute('invalid', {})).rejects.toThrow('Appointment not found');

        expect(mockRepo.update).not.toHaveBeenCalled();
    });
});
