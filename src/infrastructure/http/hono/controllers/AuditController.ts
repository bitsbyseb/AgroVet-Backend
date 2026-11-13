import type { Context } from 'hono';
import type { GetAuditLogsUseCase } from '@application/use-cases/Audit/GetAuditLogsUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class AuditController {
    constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) {}

    async list(c: Context) {
        try {
            const query = c.req.valid('query' as never) as {
                userId?: string;
                action?: string;
                resource?: string;
                from?: string;
                to?: string;
                status?: string;
                limit?: number;
                offset?: number;
            };

            const result = await this.getAuditLogsUseCase.execute({
                userId: query.userId,
                action: query.action,
                resource: query.resource,
                from: query.from,
                to: query.to,
                status: query.status,
                limit: query.limit,
                offset: query.offset
            });

            return c.json(result, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al consultar logs de auditoría', 500);
        }
    }
}
