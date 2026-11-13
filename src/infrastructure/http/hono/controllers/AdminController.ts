import type { Context } from 'hono';
import type { GetAdminIndicatorsUseCase } from '@application/use-cases/Admin/GetAdminIndicatorsUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class AdminController {
    constructor(private readonly getAdminIndicatorsUseCase: GetAdminIndicatorsUseCase) {}

    async getIndicators(c: Context) {
        try {
            const indicators = await this.getAdminIndicatorsUseCase.execute();
            return c.json(indicators, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al consultar indicadores administrativos', 500);
        }
    }
}
