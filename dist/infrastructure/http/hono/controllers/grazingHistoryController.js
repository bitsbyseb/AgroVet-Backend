import { GetGrazingHistoryUseCase } from '../../../../application/use-cases/paddocks/GetGrazingHistoryUseCase.js';
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
            const message = error?.message || 'Error desconocido';
            if (message.includes('Invalid') ||
                message.includes('cannot be after') ||
                message.includes('inválid')) {
                return c.json({ error: message }, 400);
            }
            return c.json({ error: message }, 500);
        }
    }
}
