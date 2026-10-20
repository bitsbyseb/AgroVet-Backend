import type { Context } from 'hono';
import { GetGrazingHistoryUseCase } from '@application/use-cases/paddocks/GetGrazingHistoryUseCase.js';
import type { GrazingHistoryQueryType } from '../validators/grazingHistoryValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class GrazingHistoryController {
    constructor(private readonly getGrazingHistoryUseCase: GetGrazingHistoryUseCase) {}

    async getHistory(c: Context) {
        try {
            const query = (typeof c.req.valid === 'function'
                ? (c.req.valid as any)('query')
                : {
                    animalId: c.req.query('animalId'),
                    paddockId: c.req.query('paddockId'),
                    startDate: c.req.query('startDate'),
                    endDate: c.req.query('endDate')
                }) as GrazingHistoryQueryType;

            const history = await this.getGrazingHistoryUseCase.execute(query);
            return c.json(history, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al consultar historial de pastoreo', 500);
        }
    }
}
