import { RegisterReproductionUseCase } from '../../../../application/use-cases/Reproduction/RegisterReproductionUseCase.js';
import { GetAnimalReproductionUseCase } from '../../../../application/use-cases/Reproduction/GetAnimalReproductionUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';
export class ReproductionController {
    registerReproductionUseCase;
    getAnimalReproductionUseCase;
    constructor(registerReproductionUseCase, getAnimalReproductionUseCase) {
        this.registerReproductionUseCase = registerReproductionUseCase;
        this.getAnimalReproductionUseCase = getAnimalReproductionUseCase;
    }
    async register(c) {
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
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al registrar reproducción', 400);
        }
    }
    async getReproduction(c) {
        try {
            const { id } = c.req.valid('param');
            const reproduction = await this.getAnimalReproductionUseCase.execute(id);
            return c.json(reproduction);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar reproducción del animal', 404);
        }
    }
}
