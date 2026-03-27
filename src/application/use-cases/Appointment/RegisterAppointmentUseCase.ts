import { Appointment } from "@domain/entities/Appointment.js";
import type { AppointmentRepository } from "@domain/repositories/AppointmentRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import { randomUUID } from "node:crypto";

export class RegisterAppointmentUseCase {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly animalRepository: AnimalRepository
    ) { }

    async execute(request: { 
        animalId: string; 
        date: Date; 
        reason: string; 
        status?: any; 
        createdBy: string 
    }): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }

        const appointment = new Appointment(
            randomUUID(),
            request.animalId,
            request.date,
            request.reason,
            request.status,
            request.createdBy
        );

        await this.appointmentRepository.save(appointment);
    }
}
