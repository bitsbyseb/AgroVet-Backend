import type { Context } from 'hono';
import { RegisterMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/RegisterMedicalHistoryUseCase.js';
import { ListMedicalHistoriesUseCase } from '@application/use-cases/MedicalHistory/ListMedicalHistoriesUseCase.js';

export class MedicalHistoryController {
    constructor(
        private registerMedicalHistoryUseCase: RegisterMedicalHistoryUseCase,
        private listMedicalHistoriesUseCase: ListMedicalHistoriesUseCase
    ) { }

    async listByAnimal(c: Context) {
        const animalId = c.req.param('id');
        try {
            if (!animalId) {
                throw new Error("undefined id");
            }

            const history = await this.listMedicalHistoriesUseCase.executeByAnimal(animalId);
            return c.json(history);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }

    async register(c: Context) {
        const animalId = c.req.param('id');
        const data = await c.req.json();
        try {
            await this.registerMedicalHistoryUseCase.execute({ ...data, animalId });
            return c.json({ message: 'Medical history entry added successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
