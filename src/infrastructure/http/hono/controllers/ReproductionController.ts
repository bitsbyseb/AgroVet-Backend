import { RegisterReproductionUseCase } from '@application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { GetAnimalReproductionUseCase } from '@application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';

export class ReproductionController {
    constructor(
        private registerReproductionUseCase: RegisterReproductionUseCase,
        private getAnimalReproductionUseCase: GetAnimalReproductionUseCase
    ) { }

    async register(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            const reproductionData = {
                id: randomUUID(),
                animalId: id,
                ...data
            };
            await this.registerReproductionUseCase.execute(reproductionData);
            return c.json({ message: 'Reproduction record registered successfully', id: reproductionData.id }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar reproducción', 400);
        }
    }

    async getReproduction(c: any) {
        try {
            const { id } = c.req.valid('param');
            const reproduction = await this.getAnimalReproductionUseCase.execute(id);
            return c.json(reproduction);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al consultar reproducción del animal', 404);
        }
    }
}
