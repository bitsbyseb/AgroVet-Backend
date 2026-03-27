import type { AppointmentRepository } from "@domain/repositories/AppointmentRepository.js";
import { Appointment } from "@domain/entities/Appointment.js";

export class ListAppointmentsUseCase {
    constructor(private readonly appointmentRepository: AppointmentRepository) { }

    async execute(): Promise<Appointment[]> {
        return await this.appointmentRepository.findAll();
    }

    async executeByAnimal(animalId: string): Promise<Appointment[]> {
        return await this.appointmentRepository.findByAnimalId(animalId);
    }
}
