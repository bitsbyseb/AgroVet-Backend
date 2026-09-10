import { RegisterReproductionUseCase } from '../../../../application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { GetAnimalReproductionUseCase } from '../../../../application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';
import { randomUUID } from 'node:crypto';
export class ReproductionController {
    registerReproductionUseCase;
    getAnimalReproductionUseCase;
    constructor(registerReproductionUseCase, getAnimalReproductionUseCase) {
        this.registerReproductionUseCase = registerReproductionUseCase;
        this.getAnimalReproductionUseCase = getAnimalReproductionUseCase;
    }
    async register(c) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            const reproductionData = {
                id: randomUUID(),
                animalId: id,
                ...data
            };
            await this.registerReproductionUseCase.execute(reproductionData);
            return c.json({ message: 'Reproduction record registered successfully', id: reproductionData.id }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async getReproduction(c) {
        const { id } = c.req.valid('param');
        try {
            const reproduction = await this.getAnimalReproductionUseCase.execute(id);
            return c.json(reproduction);
        }
        catch (error) {
            return c.json({ error: error.message }, 404);
        }
    }
}
