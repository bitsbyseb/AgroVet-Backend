import type { Context } from 'hono';
import type { GenerateAlertsUseCase } from '@application/use-cases/Alert/GenerateAlertsUseCase.js';
import type { GetAlertsUseCase } from '@application/use-cases/Alert/GetAlertsUseCase.js';
import type { MarkAlertAsReadUseCase } from '@application/use-cases/Alert/MarkAlertAsReadUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
import type { AlertModuleType, AlertPriority, AlertStatus } from '@domain/entities/Alert.js';

export class AlertController {
    constructor(
        private readonly generateAlertsUseCase: GenerateAlertsUseCase,
        private readonly getAlertsUseCase: GetAlertsUseCase,
        private readonly markAlertAsReadUseCase: MarkAlertAsReadUseCase
    ) {}

    /**
     * POST /api/v1/alerts/generate
     * Genera alertas automáticas para un animal evaluando todos los módulos.
     */
    async generate(c: Context) {
        try {
            const data = (c.req as any).valid('json');
            const payload = c.get('jwtPayload') as { sub: string } | undefined;
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
        } catch (error: any) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al generar alertas', status);
        }
    }

    /**
     * GET /api/v1/alerts
     * Lista alertas del sistema con filtros opcionales por query params.
     */
    async list(c: Context) {
        try {
            const query = (c.req as any).valid('query');
            const payload = c.get('jwtPayload') as { sub: string; role: string } | undefined;

            const filters = {
                userId:     query?.userId     as string | undefined,
                animalId:   query?.animalId   as string | undefined,
                status:     query?.status     as AlertStatus | undefined,
                priority:   query?.priority   as AlertPriority | undefined,
                moduleType: query?.moduleType as AlertModuleType | undefined,
                onlyDue:    query?.onlyDue === 'true'
            };

            // Si el usuario no especificó un userId y no es admin/zootechnician,
            // scope automático a sus propias alertas
            if (!filters.userId && payload?.role === 'veterinarian') {
                filters.userId = payload.sub;
            }

            const alerts = await this.getAlertsUseCase.execute(filters);
            return c.json(alerts, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al obtener alertas', 500);
        }
    }

    /**
     * GET /api/v1/alerts/pending
     * Retorna las alertas pendientes del usuario autenticado.
     */
    async listPending(c: Context) {
        try {
            const payload = c.get('jwtPayload') as { sub: string } | undefined;
            if (!payload?.sub) {
                return c.json({ error: 'No se pudo determinar el usuario autenticado' }, 401);
            }
            const alerts = await this.getAlertsUseCase.getPendingByUser(payload.sub);
            return c.json(alerts, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al obtener alertas pendientes', 500);
        }
    }

    /**
     * PATCH /api/v1/alerts/:id/read
     * Marca una alerta específica como leída.
     */
    async markAsRead(c: Context) {
        try {
            const alertId = c.req.param('id');
            if (!alertId) {
                return c.json({ error: 'Alert ID is required' }, 400);
            }
            const updated = await this.markAlertAsReadUseCase.execute(alertId);
            return c.json({ message: 'Alerta marcada como leída', data: updated }, 200);
        } catch (error: any) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al marcar alerta como leída', status);
        }
    }

    /**
     * PATCH /api/v1/alerts/read-all
     * Marca todas las alertas pendientes del usuario autenticado como leídas.
     */
    async markAllAsRead(c: Context) {
        try {
            const payload = c.get('jwtPayload') as { sub: string } | undefined;
            if (!payload?.sub) {
                return c.json({ error: 'No se pudo determinar el usuario autenticado' }, 401);
            }
            const result = await this.markAlertAsReadUseCase.executeMarkAll(payload.sub);
            return c.json({
                message: 'Todas las alertas marcadas como leídas',
                marked: result.marked
            }, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al marcar todas las alertas', 500);
        }
    }
}
