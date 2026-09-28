import { RegisterGrazingActivityUseCase } from '../../../../application/use-cases/paddocks/RegisterGrazingActivityUseCase.js';
import { GetGrazingActivitiesUseCase } from '../../../../application/use-cases/paddocks/GetGrazingActivitiesUseCase.js';
export class GrazingController {
    registerGrazingActivityUseCase;
    getGrazingActivitiesUseCase;
    constructor(registerGrazingActivityUseCase, getGrazingActivitiesUseCase) {
        this.registerGrazingActivityUseCase = registerGrazingActivityUseCase;
        this.getGrazingActivitiesUseCase = getGrazingActivitiesUseCase;
    }
    async register(c) {
        const data = c.req.valid('json');
        try {
            const grazingActivity = await this.registerGrazingActivityUseCase.execute(data);
            return c.json({
                message: 'Actividad de pastoreo registrada exitosamente',
                id: grazingActivity.id
            }, 201);
        }
        catch (error) {
            const status = error.message === 'Paddock not found' ? 404 : 400;
            return c.json({ error: error.message }, status);
        }
    }
    async list(c) {
        try {
            const paddockId = c.req.query('paddockId');
            const activities = await this.getGrazingActivitiesUseCase.execute(paddockId);
            return c.json(activities, 200);
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    }
}
