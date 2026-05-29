import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterAppointmentUseCase } from '@application/use-cases/Appointment/RegisterAppointmentUseCase.js';
import { Appointment, AppointmentStatus } from '@domain/entities/Appointment.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { AppointmentRepository } from '@domain/repositories/AppointmentRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import { randomUUID } from 'node:crypto';

describe('RegisterAppointmentUseCase', () => {
    let mockAppointmentRepo: ReturnType<typeof vi.fn>;
    let mockAnimalRepo: ReturnType<typeof vi.fn>;
    let useCase: RegisterAppointmentUseCase;

    beforeEach(() => {
        mockAppointmentRepo = { save: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        mockAnimalRepo = { findById: vi.fn() } as unknown as ReturnType<typeof vi.fn>;
        useCase = new RegisterAppointmentUseCase(mockAppointmentRepo as unknown as AppointmentRepository, mockAnimalRepo as unknown as AnimalRepository);
    });

    it('should register an appointment successfully', async () => {
        const animalId = randomUUID();
        const mockAnimal = new Animal(animalId, 'Rex', speciesType.CANINE, animalType.URBAN, 'Bulldog', Gender.MALE, new Date(), Status.ACTIVE, 'Brown', randomUUID());
        (mockAnimalRepo.findById as any).mockResolvedValue(mockAnimal);

        await useCase.execute({
            animalId,
            date: new Date(),
            reason: 'Checkup',
            createdBy: 'User1'
        });

        expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animalId);
        expect(mockAppointmentRepo.save).toHaveBeenCalled();
    });

    it('should throw error if animal not found', async () => {
        (mockAnimalRepo.findById as any).mockResolvedValue(null);

        await expect(useCase.execute({
            animalId: 'invalid', date: new Date(), reason: 'R', createdBy: 'U'
        })).rejects.toThrow('Animal not found');

        expect(mockAppointmentRepo.save).not.toHaveBeenCalled();
    });
});
