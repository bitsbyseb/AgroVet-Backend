import { Appointment } from "../entities/Appointment.js";

export interface AppointmentRepository {
    save(appointment: Appointment): Promise<void>;
    findById(id: string): Promise<Appointment | null>;
    findByAnimalId(animalId: string): Promise<Appointment[]>;
    findAll(): Promise<Appointment[]>;
    update(appointment: Appointment): Promise<void>;
    delete(id: string): Promise<void>;
}
