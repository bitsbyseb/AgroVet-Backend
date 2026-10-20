import { Appointment, AppointmentStatus } from "@domain/entities/Appointment.js";
import type { AppointmentRepository } from "@domain/repositories/AppointmentRepository.js";
import { Appointment as AppointmentModel } from "../models/Appointment.model.js";
import { cleanWhereClause } from "../utils/whereHelper.js";

export class SequelizeAppointmentRepository implements AppointmentRepository {
    async save(appointment: Appointment): Promise<void> {
        await AppointmentModel.create({
            id: appointment.id,
            animalId: appointment.animalId,
            date: appointment.date,
            reason: appointment.reason,
            status: appointment.status,
            createdBy: appointment.createdBy
        });
    }

    async findById(id: string): Promise<Appointment | null> {
        if (!id || id.trim() === '') return null;
        const model = await AppointmentModel.findByPk(id);
        if (!model) return null;
        return this.toDomain(model);
    }

    async findByAnimalId(animalId: string): Promise<Appointment[]> {
        if (!animalId || animalId.trim() === '') return [];
        const where = cleanWhereClause({ animalId });
        const models = await AppointmentModel.findAll({ where });
        return models.map((model) => this.toDomain(model));
    }

    async findAll(): Promise<Appointment[]> {
        const models = await AppointmentModel.findAll();
        return models.map((model) => this.toDomain(model));
    }

    async update(appointment: Appointment): Promise<void> {
        if (!appointment.id || appointment.id.trim() === '') return;
        await AppointmentModel.update({
            animalId: appointment.animalId,
            date: appointment.date,
            reason: appointment.reason,
            status: appointment.status,
            createdBy: appointment.createdBy
        }, {
            where: cleanWhereClause({ id: appointment.id })
        });
    }

    async delete(id: string): Promise<void> {
        if (!id || id.trim() === '') return;
        await AppointmentModel.destroy({
            where: cleanWhereClause({ id })
        });
    }

    private toDomain(model: AppointmentModel): Appointment {
        return new Appointment(
            model.id,
            model.animalId,
            model.date,
            model.reason,
            model.status as AppointmentStatus,
            model.createdBy,
            model.createdAt,
            model.updatedAt
        );
    }
}
