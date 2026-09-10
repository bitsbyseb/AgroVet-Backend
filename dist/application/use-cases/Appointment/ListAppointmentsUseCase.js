import { Appointment } from "../../../domain/entities/Appointment.js";
export class ListAppointmentsUseCase {
    appointmentRepository;
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async execute() {
        return await this.appointmentRepository.findAll();
    }
    async executeByAnimal(animalId) {
        return await this.appointmentRepository.findByAnimalId(animalId);
    }
}
