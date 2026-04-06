import { Hono } from 'hono';
import { AppointmentController } from '../controllers/AppointmentController.js';
import { appointmentValidator, updateAppointmentValidator } from '../validators/AppointmentValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';

export function createAppointmentRouter(appointmentController: AppointmentController) {
    const router = new Hono();

    router.use('*', authMiddleware);

    router.get('/', rbacMiddleware('consultas_veterinarias'), (c) => appointmentController.list(c));
    router.post('/', rbacMiddleware('consultas_veterinarias'), appointmentValidator, (c) => appointmentController.register(c));
    router.patch('/:id', rbacMiddleware('consultas_veterinarias'), updateAppointmentValidator, (c) => appointmentController.updateStatus(c));

    return router;
}
