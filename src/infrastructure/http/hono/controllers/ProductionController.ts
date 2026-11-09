import { RegisterProductionUseCase } from '@application/use-cases/Production/RegisterProductionUseCase.js';
import { GetAnimalProductionUseCase } from '@application/use-cases/Production/GetAnimalProductionUseCase.js';
import { GetProductionIndicatorsUseCase } from '@application/use-cases/Production/GetProductionIndicatorsUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';

export class ProductionController {
    constructor(
        private registerProductionUseCase: RegisterProductionUseCase,
        private getAnimalProductionUseCase: GetAnimalProductionUseCase,
        private getProductionIndicatorsUseCase: GetProductionIndicatorsUseCase
    ) { }

    async register(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            const productionData = {
                id: randomUUID(),
                animalId: id,
                ...data,
                recordDate: data.recordDate ? new Date(data.recordDate) : new Date(),
                productionDate: data.productionDate ? new Date(data.productionDate) : null,
                weightGain: data.weightGain ?? null,
                productQuality: data.productQuality ?? null
            };
            await this.registerProductionUseCase.execute(productionData);
            return c.json({ message: 'Production record registered successfully', id: productionData.id }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar producción', 400);
        }
    }

    async getProduction(c: any) {
        try {
            const { id } = c.req.valid('param');
            const production = await this.getAnimalProductionUseCase.execute(id);
            return c.json(production);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al consultar producción del animal', 404);
        }
    }

    async getIndicators(c: any) {
        try {
            const { id } = c.req.valid('param');
            const query = c.req.valid('query');
            const indicators = await this.getProductionIndicatorsUseCase.execute({
                animalId: id,
                from: query?.from,
                to: query?.to
            });
            return c.json(indicators);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al calcular indicadores de producción', 404);
        }
    }
}
