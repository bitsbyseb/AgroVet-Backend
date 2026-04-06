import { RegisterReproductionUseCase } from '@application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { GetAnimalReproductionUseCase } from '@application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';
import { v4 as uuidv4 } from 'uuid';

export class ReproductionController {
    constructor(
        private registerReproductionUseCase: RegisterReproductionUseCase,
        private getAnimalReproductionUseCase: GetAnimalReproductionUseCase
    ) { }

    async register(c: any) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            const reproductionData = {
                id: uuidv4(),
                animalId: id,
                ...data
            };
            await this.registerReproductionUseCase.execute(reproductionData);
            return c.json({ message: 'Reproduction record registered successfully', id: reproductionData.id }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getReproduction(c: any) {
        const { id } = c.req.valid('param');
        try {
            const reproduction = await this.getAnimalReproductionUseCase.execute(id);
            return c.json(reproduction);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }
}
