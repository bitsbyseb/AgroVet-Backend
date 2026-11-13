import { handleControllerError } from '../utils/errorHandler.js';
export class AdminController {
    getAdminIndicatorsUseCase;
    constructor(getAdminIndicatorsUseCase) {
        this.getAdminIndicatorsUseCase = getAdminIndicatorsUseCase;
    }
    async getIndicators(c) {
        try {
            const indicators = await this.getAdminIndicatorsUseCase.execute();
            return c.json(indicators, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar indicadores administrativos', 500);
        }
    }
}
