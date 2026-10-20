import { RegisterAlimentationUseCase } from '@application/use-cases/Alimentation/RegisterAlimentationUseCase.js';
import { GetAnimalDietUseCase } from '@application/use-cases/Alimentation/GetAnimalDietUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';

export class AlimentationController {
    constructor(
        private registerAlimentationUseCase: RegisterAlimentationUseCase,
        private getAnimalDietUseCase: GetAnimalDietUseCase
    ) {}

    async register(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            const alimentationData = {
                id: randomUUID(),
                animalId: id,
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : new Date(),
                endDate: data.endDate ? new Date(data.endDate) : new Date()
            };
            await this.registerAlimentationUseCase.execute(alimentationData);
            return c.json({ message: 'Alimentation registered successfully', id: alimentationData.id }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar la alimentación', 400);
        }
    }

    async getDiet(c: any) {
        try {
            const { id } = c.req.valid('param');
            const diet = await this.getAnimalDietUseCase.execute(id);
            return c.json(diet);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al consultar dieta del animal', 404);
        }
    }
}
