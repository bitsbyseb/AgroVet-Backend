import { RegisterGrazingActivityUseCase } from '@application/use-cases/paddocks/RegisterGrazingActivityUseCase.js';
import { GetGrazingActivitiesUseCase } from '@application/use-cases/paddocks/GetGrazingActivitiesUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class GrazingController {
    constructor(
        private registerGrazingActivityUseCase: RegisterGrazingActivityUseCase,
        private getGrazingActivitiesUseCase: GetGrazingActivitiesUseCase
    ) {}

    async register(c: any) {
        try {
            const data = c.req.valid('json');
            const grazingActivity = await this.registerGrazingActivityUseCase.execute(data);
            return c.json({
                message: 'Actividad de pastoreo registrada exitosamente',
                id: grazingActivity.id
            }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar actividad de pastoreo', 400);
        }
    }

    async list(c: any) {
        try {
            const paddockId = c.req.query('paddockId');
            const activities = await this.getGrazingActivitiesUseCase.execute(paddockId);
            return c.json(activities, 200);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al listar actividades de pastoreo', 500);
        }
    }
}
