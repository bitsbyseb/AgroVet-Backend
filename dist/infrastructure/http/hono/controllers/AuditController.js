import { handleControllerError } from '../utils/errorHandler.js';
export class AuditController {
    getAuditLogsUseCase;
    constructor(getAuditLogsUseCase) {
        this.getAuditLogsUseCase = getAuditLogsUseCase;
    }
    async list(c) {
        try {
            const query = c.req.valid('query');
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
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar logs de auditoría', 500);
        }
    }
}
