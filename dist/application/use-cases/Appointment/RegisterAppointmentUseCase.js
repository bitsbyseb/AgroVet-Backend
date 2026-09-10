import { Appointment } from "../../../domain/entities/Appointment.js";
import { randomUUID } from "node:crypto";
export class RegisterAppointmentUseCase {
    appointmentRepository;
    animalRepository;
    constructor(appointmentRepository, animalRepository) {
        this.appointmentRepository = appointmentRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }
        const appointment = new Appointment(randomUUID(), request.animalId, request.date, request.reason, request.status, request.createdBy);
        await this.appointmentRepository.save(appointment);
    }
}
