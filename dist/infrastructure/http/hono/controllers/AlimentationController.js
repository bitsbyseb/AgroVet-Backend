import { RegisterAlimentationUseCase } from '../../../../application/use-cases/Alimentation/RegisterAlimentationUseCase.js';
import { GetAnimalDietUseCase } from '../../../../application/use-cases/Alimentation/GetAnimalDietUseCase.js';
import { randomUUID } from 'node:crypto';
export class AlimentationController {
    registerAlimentationUseCase;
    getAnimalDietUseCase;
    constructor(registerAlimentationUseCase, getAnimalDietUseCase) {
        this.registerAlimentationUseCase = registerAlimentationUseCase;
        this.getAnimalDietUseCase = getAnimalDietUseCase;
    }
    async register(c) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            const alimentationData = {
                id: randomUUID(),
                animalId: id,
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : new Date(),
                endDate: data.endDate ? new Date(data.endDate) : new Date()
            };
            await this.registerAlimentationUseCase.execute(alimentationData);
            return c.json({ message: 'Alimentation registered successfully', id: alimentationData.id }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async getDiet(c) {
        const { id } = c.req.valid('param');
        try {
            const diet = await this.getAnimalDietUseCase.execute(id);
            return c.json(diet);
        }
        catch (error) {
            return c.json({ error: error.message }, 404);
        }
    }
}
