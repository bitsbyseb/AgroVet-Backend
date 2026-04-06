import type { Context } from 'hono';
import { RegisterReproductionUseCase } from '@application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { GetAnimalReproductionUseCase } from '@application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';
import { v4 as uuidv4 } from 'uuid';

export class ReproductionController {
    constructor(
        private registerReproductionUseCase: RegisterReproductionUseCase,
        private getAnimalReproductionUseCase: GetAnimalReproductionUseCase
    ) { }

    async register(c: Context) {
        const animalId = c.req.param('id');
        try {
            const data = await c.req.json();
            const reproductionData = {
                id: uuidv4(),
                animalId,
                ...data
            };
            await this.registerReproductionUseCase.execute(reproductionData);
            return c.json({ message: 'Reproduction record registered successfully', id: reproductionData.id }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getReproduction(c: Context) {
        const animalId = c.req.param('id');
        try {
            if (!animalId) {
                throw new Error("no id found")
            }
            const reproduction = await this.getAnimalReproductionUseCase.execute(animalId);
            return c.json(reproduction);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }
}
