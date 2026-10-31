import { handleControllerError } from '../utils/errorHandler.js';
export class AlertController {
    generateAlertsUseCase;
    getAlertsUseCase;
    markAlertAsReadUseCase;
    constructor(generateAlertsUseCase, getAlertsUseCase, markAlertAsReadUseCase) {
        this.generateAlertsUseCase = generateAlertsUseCase;
        this.getAlertsUseCase = getAlertsUseCase;
        this.markAlertAsReadUseCase = markAlertAsReadUseCase;
    }
    /**
     * POST /api/v1/alerts/generate
     * Genera alertas automáticas para un animal evaluando todos los módulos.
     */
    async generate(c) {
        try {
            const data = c.req.valid('json');
            const payload = c.get('jwtPayload');
            const userId = payload?.sub;
            if (!userId) {
                return c.json({ error: 'No se pudo determinar el usuario autenticado' }, 401);
            }
            const result = await this.generateAlertsUseCase.execute({
                animalId: data.animalId,
                userId,
                daysAhead: data.daysAhead ?? 7
            });
            return c.json({
                message: `Alertas generadas correctamente`,
                generated: result.generated,
                alerts: result.alerts
            }, 201);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al generar alertas', status);
        }
    }
    /**
     * GET /api/v1/alerts
     * Lista alertas del sistema con filtros opcionales por query params.
     */
    async list(c) {
        try {
            const query = c.req.valid('query');
            const payload = c.get('jwtPayload');
            const filters = {
                userId: query?.userId,
                animalId: query?.animalId,
                status: query?.status,
                priority: query?.priority,
                moduleType: query?.moduleType,
                onlyDue: query?.onlyDue === 'true'
            };
            // Si el usuario no especificó un userId y no es admin/zootechnician,
            // scope automático a sus propias alertas
            if (!filters.userId && payload?.role === 'veterinarian') {
                filters.userId = payload.sub;
            }
            const alerts = await this.getAlertsUseCase.execute(filters);
            return c.json(alerts, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al obtener alertas', 500);
        }
    }
    /**
     * GET /api/v1/alerts/pending
     * Retorna las alertas pendientes del usuario autenticado.
     */
    async listPending(c) {
        try {
            const payload = c.get('jwtPayload');
            if (!payload?.sub) {
                return c.json({ error: 'No se pudo determinar el usuario autenticado' }, 401);
            }
            const alerts = await this.getAlertsUseCase.getPendingByUser(payload.sub);
            return c.json(alerts, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al obtener alertas pendientes', 500);
        }
    }
    /**
     * PATCH /api/v1/alerts/:id/read
     * Marca una alerta específica como leída.
     */
    async markAsRead(c) {
        try {
            const alertId = c.req.param('id');
            if (!alertId) {
                return c.json({ error: 'Alert ID is required' }, 400);
            }
            const updated = await this.markAlertAsReadUseCase.execute(alertId);
            return c.json({ message: 'Alerta marcada como leída', data: updated }, 200);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al marcar alerta como leída', status);
        }
    }
    /**
     * PATCH /api/v1/alerts/read-all
     * Marca todas las alertas pendientes del usuario autenticado como leídas.
     */
    async markAllAsRead(c) {
        try {
            const payload = c.get('jwtPayload');
            if (!payload?.sub) {
                return c.json({ error: 'No se pudo determinar el usuario autenticado' }, 401);
            }
            const result = await this.markAlertAsReadUseCase.executeMarkAll(payload.sub);
            return c.json({
                message: 'Todas las alertas marcadas como leídas',
                marked: result.marked
            }, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al marcar todas las alertas', 500);
        }
    }
}
