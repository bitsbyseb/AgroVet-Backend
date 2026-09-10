import { RegisterProductionUseCase } from '../../../../application/use-cases/Production/RegisterProductionUseCase.js';
import { GetAnimalProductionUseCase } from '../../../../application/use-cases/Production/GetAnimalProductionUseCase.js';
import { randomUUID } from 'node:crypto';
export class ProductionController {
    registerProductionUseCase;
    getAnimalProductionUseCase;
    constructor(registerProductionUseCase, getAnimalProductionUseCase) {
        this.registerProductionUseCase = registerProductionUseCase;
        this.getAnimalProductionUseCase = getAnimalProductionUseCase;
    }
    async register(c) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            const productionData = {
                id: randomUUID(),
                animalId: id,
                ...data,
                recordDate: data.recordDate ? new Date(data.recordDate) : new Date()
            };
            await this.registerProductionUseCase.execute(productionData);
            return c.json({ message: 'Production record registered successfully', id: productionData.id }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async getProduction(c) {
        const { id } = c.req.valid('param');
        try {
            const production = await this.getAnimalProductionUseCase.execute(id);
            return c.json(production);
        }
        catch (error) {
            return c.json({ error: error.message }, 404);
        }
    }
}
