import { Appointment, AppointmentStatus } from "../../../domain/entities/Appointment.js";
export class UpdateAppointmentUseCase {
    appointmentRepository;
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async execute(id, data) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        appointment.update(data);
        await this.appointmentRepository.update(appointment);
    }
}
