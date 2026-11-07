import { RegisterReproductiveEventUseCase } from '../../../../application/use-cases/Reproduction/RegisterReproductiveEventUseCase.js';
import { GetReproductionHistoryUseCase } from '../../../../application/use-cases/Reproduction/GetReproductionHistoryUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
export class ReproductionController {
    registerReproductiveEventUseCase;
    getReproductionHistoryUseCase;
    constructor(registerReproductiveEventUseCase, getReproductionHistoryUseCase) {
        this.registerReproductiveEventUseCase = registerReproductiveEventUseCase;
        this.getReproductionHistoryUseCase = getReproductionHistoryUseCase;
    }
    async register(c) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            const result = await this.registerReproductiveEventUseCase.execute({
                animalId: id,
                ...data
            });
            return c.json({
                message: 'Reproduction record registered successfully',
                id: result.id,
                record: {
                    id: result.id,
                    animalId: result.animalId,
                    reproductiveStatus: result.reproductiveStatus,
                    lastCalvingDate: result.lastCalvingDate,
                    offspringCount: result.offspringCount,
                    breedingType: result.breedingType,
                    heatDate: result.heatDate ? result.heatDate.toISOString() : null,
                    expectedCalvingDate: result.expectedCalvingDate ? result.expectedCalvingDate.toISOString() : null,
                    bullId: result.bullId,
                    semenBatch: result.semenBatch,
                    inseminationDetails: result.inseminationDetails,
                    createdAt: result.createdAt ? result.createdAt.toISOString() : undefined,
                    updatedAt: result.updatedAt ? result.updatedAt.toISOString() : undefined
                }
            }, 201);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al registrar evento reproductivo', status);
        }
    }
    async getReproduction(c) {
        try {
            const { id } = c.req.valid('param');
            const records = await this.getReproductionHistoryUseCase.execute(id);
            const serialized = records.map((record) => ({
                id: record.id,
                animalId: record.animalId,
                reproductiveStatus: record.reproductiveStatus,
                lastCalvingDate: record.lastCalvingDate,
                offspringCount: record.offspringCount,
                breedingType: record.breedingType,
                heatDate: record.heatDate ? record.heatDate.toISOString() : null,
                expectedCalvingDate: record.expectedCalvingDate ? record.expectedCalvingDate.toISOString() : null,
                bullId: record.bullId,
                semenBatch: record.semenBatch,
                inseminationDetails: record.inseminationDetails,
                createdAt: record.createdAt ? record.createdAt.toISOString() : undefined,
                updatedAt: record.updatedAt ? record.updatedAt.toISOString() : undefined
            }));
            return c.json(serialized, 200);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al consultar historial reproductivo del animal', status);
        }
    }
}
