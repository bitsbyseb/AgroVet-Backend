import { RegisterGrazingActivityUseCase } from '../../../../application/use-cases/paddocks/RegisterGrazingActivityUseCase.js';
export class GrazingController {
    registerGrazingActivityUseCase;
    constructor(registerGrazingActivityUseCase) {
        this.registerGrazingActivityUseCase = registerGrazingActivityUseCase;
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
}
