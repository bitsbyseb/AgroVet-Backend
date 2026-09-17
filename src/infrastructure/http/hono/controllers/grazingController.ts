import { RegisterGrazingActivityUseCase } from '@application/use-cases/paddocks/RegisterGrazingActivityUseCase.js';

export class GrazingController {
    constructor(
        private registerGrazingActivityUseCase: RegisterGrazingActivityUseCase
    ) {}

    async register(c: any) {
        const data = c.req.valid('json');
        try {
            const grazingActivity = await this.registerGrazingActivityUseCase.execute(data);
            return c.json({
                message: 'Actividad de pastoreo registrada exitosamente',
                id: grazingActivity.id
            }, 201);
        } catch (error: any) {
            const status = error.message === 'Paddock not found' ? 404 : 400;
            return c.json({ error: error.message }, status);
        }
    }
}
