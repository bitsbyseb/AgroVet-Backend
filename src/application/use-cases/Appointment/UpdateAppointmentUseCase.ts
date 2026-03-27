import type { AppointmentRepository } from "@domain/repositories/AppointmentRepository.js";
import { Appointment, AppointmentStatus } from "@domain/entities/Appointment.js";

export class UpdateAppointmentUseCase {
    constructor(private readonly appointmentRepository: AppointmentRepository) { }

    async execute(id: string, data: { date?: Date; reason?: string; status?: AppointmentStatus }): Promise<void> {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new Error("Appointment not found");
        }

        appointment.update(data);
        await this.appointmentRepository.update(appointment);
    }
}
