import { RegisterAppointmentUseCase } from '@application/use-cases/Appointment/RegisterAppointmentUseCase.js';
import { ListAppointmentsUseCase } from '@application/use-cases/Appointment/ListAppointmentsUseCase.js';
import { UpdateAppointmentUseCase } from '@application/use-cases/Appointment/UpdateAppointmentUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class AppointmentController {
    constructor(
        private registerAppointmentUseCase: RegisterAppointmentUseCase,
        private listAppointmentsUseCase: ListAppointmentsUseCase,
        private updateAppointmentUseCase: UpdateAppointmentUseCase
    ) { }

    async list(c: any) {
        try {
            const appointments = await this.listAppointmentsUseCase.execute();
            return c.json(appointments);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al listar citas', 500);
        }
    }

    async register(c: any) {
        try {
            const data = c.req.valid('json');
            const payload = c.get('jwtPayload');
            await this.registerAppointmentUseCase.execute({
                ...data,
                createdBy: payload.sub,
                date: new Date(data.date)
            });
            return c.json({ message: 'Appointment scheduled successfully' }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al programar cita', 400);
        }
    }

    async updateStatus(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.updateAppointmentUseCase.execute(id, { status: data.status });
            return c.json({ message: 'Appointment status updated successfully' });
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al actualizar estado de la cita', 400);
        }
    }
}
