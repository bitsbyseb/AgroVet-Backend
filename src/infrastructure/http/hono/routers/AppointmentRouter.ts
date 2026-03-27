import { Hono } from 'hono';
import { AppointmentController } from '../controllers/AppointmentController.js';
import { appointmentValidator, updateAppointmentValidator } from '../validators/AppointmentValidator.js';

export function createAppointmentRouter(appointmentController: AppointmentController) {
    const router = new Hono();

    router.get('/', (c) => appointmentController.list(c));
    router.post('/', appointmentValidator, (c) => appointmentController.register(c));
    router.patch('/:id', updateAppointmentValidator, (c) => appointmentController.updateStatus(c));

    return router;
}
