import { RegisterAppointmentUseCase } from '@application/use-cases/Appointment/RegisterAppointmentUseCase.js';
import { ListAppointmentsUseCase } from '@application/use-cases/Appointment/ListAppointmentsUseCase.js';
import { UpdateAppointmentUseCase } from '@application/use-cases/Appointment/UpdateAppointmentUseCase.js';

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
            return c.json({ error: error.message }, 500);
        }
    }

    async register(c: any) {
        const data = c.req.valid('json');
        const payload = c.get('jwtPayload');

        try {
            await this.registerAppointmentUseCase.execute({
                ...data,
                createdBy: payload.sub,
                date: new Date(data.date)
            });
            return c.json({ message: 'Appointment scheduled successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async updateStatus(c: any) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            await this.updateAppointmentUseCase.execute(id, { status: data.status });
            return c.json({ message: 'Appointment status updated successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
