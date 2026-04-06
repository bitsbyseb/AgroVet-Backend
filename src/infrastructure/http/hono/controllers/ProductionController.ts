import type { Context } from 'hono';
import { RegisterProductionUseCase } from '@application/use-cases/Production/RegisterProductionUseCase.js';
import { GetAnimalProductionUseCase } from '@application/use-cases/Production/GetAnimalProductionUseCase.js';
import { v4 as uuidv4 } from 'uuid';

export class ProductionController {
    constructor(
        private registerProductionUseCase: RegisterProductionUseCase,
        private getAnimalProductionUseCase: GetAnimalProductionUseCase
    ) { }

    async register(c: Context) {
        const animalId = c.req.param('id');
        try {
            const data = await c.req.json();
            const productionData = {
                id: uuidv4(),
                animalId,
                ...data,
                recordDate: data.recordDate ? new Date(data.recordDate) : new Date()
            };
            await this.registerProductionUseCase.execute(productionData);
            return c.json({ message: 'Production record registered successfully', id: productionData.id }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getProduction(c: Context) {
        const animalId = c.req.param('id');
        try {
            if (!animalId) {
                throw new Error("no id found")
            }
            const production = await this.getAnimalProductionUseCase.execute(animalId);
            return c.json(production);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }
}
