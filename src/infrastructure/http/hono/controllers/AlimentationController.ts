import { RegisterAlimentationUseCase } from '@application/use-cases/Alimentation/RegisterAlimentationUseCase.js';
import { GetAnimalDietUseCase } from '@application/use-cases/Alimentation/GetAnimalDietUseCase.js';
import { v4 as uuidv4 } from 'uuid';

export class AlimentationController {
    constructor(
        private registerAlimentationUseCase: RegisterAlimentationUseCase,
        private getAnimalDietUseCase: GetAnimalDietUseCase
    ) {}

    async register(c: any) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            const alimentationData = {
                id: uuidv4(),
                animalId: id,
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : new Date(),
                endDate: data.endDate ? new Date(data.endDate) : new Date()
            };
            await this.registerAlimentationUseCase.execute(alimentationData);
            return c.json({ message: 'Alimentation registered successfully', id: alimentationData.id }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getDiet(c: any) {
        const { id } = c.req.valid('param');
        try {
            const diet = await this.getAnimalDietUseCase.execute(id);
            return c.json(diet);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }
}
