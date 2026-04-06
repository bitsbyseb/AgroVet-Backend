import type { Context } from 'hono';
import { RegisterAlimentationUseCase } from '@application/use-cases/Alimentation/RegisterAlimentationUseCase.js';
import { GetAnimalDietUseCase } from '@application/use-cases/Alimentation/GetAnimalDietUseCase.js';
import { v4 as uuidv4 } from 'uuid';

export class AlimentationController {
    constructor(
        private registerAlimentationUseCase: RegisterAlimentationUseCase,
        private getAnimalDietUseCase: GetAnimalDietUseCase
    ) {}

    async register(c: Context) {
        const animalId = c.req.param('id');
        try {
            const data = await c.req.json();
            const alimentationData = {
                id: uuidv4(),
                animalId,
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            };
            await this.registerAlimentationUseCase.execute(alimentationData);
            return c.json({ message: 'Alimentation registered successfully', id: alimentationData.id }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getDiet(c: Context) {
        const animalId = c.req.param('id');
        try {
            if (!animalId) {
                throw new Error("no id found")
            }
            const diet = await this.getAnimalDietUseCase.execute(animalId);
            return c.json(diet);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }
}
