import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AppointmentController } from '../controllers/AppointmentController.js';
import { appointmentSchema, updateAppointmentSchema, appointmentResponseSchema, appointmentListResponseSchema } from '../validators/AppointmentValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export function createAppointmentRouter(appointmentController: AppointmentController) {
    const router = new OpenAPIHono();

    router.use('*', authMiddleware);

    const listAppointmentsRoute = createRoute({
        method: 'get',
        path: '/',
        summary: 'Listar todas las consultas veterinarias',
        security: [{ Bearer: [] }],
        responses: {
            200: { content: { 'application/json': { schema: appointmentListResponseSchema } }, description: 'Lista de consultas' }
        },
        tags: ['Consultas']
    });

    const registerAppointmentRoute = createRoute({
        method: 'post',
        path: '/',
        summary: 'Registrar una nueva consulta',
        security: [{ Bearer: [] }],
        request: { body: { content: { 'application/json': { schema: appointmentSchema } } } },
        responses: {
            201: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Consulta registrada' },
            400: { content: { 'application/json': { schema: errorResponseSchema } }, description: 'Datos inválidos' }
        },
        tags: ['Consultas']
    });

    const updateAppointmentRoute = createRoute({
        method: 'patch',
        path: '/{id}',
        summary: 'Actualizar estado de consulta',
        security: [{ Bearer: [] }],
        request: { 
            params: z.object({ id: z.string() }),
            body: { content: { 'application/json': { schema: updateAppointmentSchema } } } 
        },
        responses: {
            200: { content: { 'application/json': { schema: z.object({ message: z.string() }) } }, description: 'Estado actualizado' }
        },
        tags: ['Consultas']
    });

    router.use('/', rbacMiddleware('consultas_veterinarias'));
    router.use('/:id', rbacMiddleware('consultas_veterinarias'));

    router.openapi(listAppointmentsRoute, (c) => appointmentController.list(c));
    router.openapi(registerAppointmentRoute, (c) => appointmentController.register(c));
    router.openapi(updateAppointmentRoute, (c) => appointmentController.updateStatus(c));

    return router;
}
