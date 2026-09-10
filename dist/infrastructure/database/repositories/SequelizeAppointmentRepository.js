import { Appointment, AppointmentStatus } from "../../../domain/entities/Appointment.js";
import { Appointment as AppointmentModel } from "../models/Appointment.model.js";
export class SequelizeAppointmentRepository {
    async save(appointment) {
        await AppointmentModel.create({
            id: appointment.id,
            animalId: appointment.animalId,
            date: appointment.date,
            reason: appointment.reason,
            status: appointment.status,
            createdBy: appointment.createdBy
        });
    }
    async findById(id) {
        const model = await AppointmentModel.findByPk(id);
        if (!model)
            return null;
        return this.toDomain(model);
    }
    async findByAnimalId(animalId) {
        const models = await AppointmentModel.findAll({ where: { animalId } });
        return models.map(this.toDomain);
    }
    async findAll() {
        const models = await AppointmentModel.findAll();
        return models.map(this.toDomain);
    }
    async update(appointment) {
        await AppointmentModel.update({
            animalId: appointment.animalId,
            date: appointment.date,
            reason: appointment.reason,
            status: appointment.status,
            createdBy: appointment.createdBy
        }, {
            where: { id: appointment.id }
        });
    }
    async delete(id) {
        await AppointmentModel.destroy({ where: { id } });
    }
    toDomain(model) {
        return new Appointment(model.id, model.animalId, model.date, model.reason, model.status, model.createdBy, model.createdAt, model.updatedAt);
    }
}
