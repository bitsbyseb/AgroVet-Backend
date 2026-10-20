import { GetGrazingHistoryUseCase } from '../../../../application/use-cases/paddocks/GetGrazingHistoryUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
export class GrazingHistoryController {
    getGrazingHistoryUseCase;
    constructor(getGrazingHistoryUseCase) {
        this.getGrazingHistoryUseCase = getGrazingHistoryUseCase;
    }
    async getHistory(c) {
        try {
            const query = (typeof c.req.valid === 'function'
                ? c.req.valid('query')
                : {
                    animalId: c.req.query('animalId'),
                    paddockId: c.req.query('paddockId'),
                    startDate: c.req.query('startDate'),
                    endDate: c.req.query('endDate')
                });
            const history = await this.getGrazingHistoryUseCase.execute(query);
            return c.json(history, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar historial de pastoreo', 500);
        }
    }
}
