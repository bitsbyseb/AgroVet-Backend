import { CreateMedicalHistoryUseCase } from '../../../../application/use-cases/MedicalHistory/CreateMedicalHistoryUseCase.js';
import { GetMedicalHistoryByAnimalUseCase } from '../../../../application/use-cases/MedicalHistory/GetMedicalHistoryByAnimalUseCase.js';
import { UpdateMedicalHistoryUseCase } from '../../../../application/use-cases/MedicalHistory/UpdateMedicalHistoryUseCase.js';
import { RegisterMedicalHistoryUseCase } from '../../../../application/use-cases/MedicalHistory/RegisterMedicalHistoryUseCase.js';
import { ListMedicalHistoriesUseCase } from '../../../../application/use-cases/MedicalHistory/ListMedicalHistoriesUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
export class MedicalHistoryController {
    createMedicalHistoryUseCase;
    getMedicalHistoryByAnimalUseCase;
    updateMedicalHistoryUseCase;
    registerMedicalHistoryUseCase;
    listMedicalHistoriesUseCase;
    constructor(createMedicalHistoryUseCase, getMedicalHistoryByAnimalUseCase, updateMedicalHistoryUseCase, registerMedicalHistoryUseCase, listMedicalHistoriesUseCase) {
        this.createMedicalHistoryUseCase = createMedicalHistoryUseCase;
        this.getMedicalHistoryByAnimalUseCase = getMedicalHistoryByAnimalUseCase;
        this.updateMedicalHistoryUseCase = updateMedicalHistoryUseCase;
        this.registerMedicalHistoryUseCase = registerMedicalHistoryUseCase;
        this.listMedicalHistoriesUseCase = listMedicalHistoriesUseCase;
    }
    /**
     * Obtiene el historial médico enriquecido de un animal.
     */
    async listByAnimal(c) {
        try {
            const params = c.req.param();
            const animalId = params.animalId || params.id;
            if (!animalId) {
                return c.json({ error: 'Animal ID is required' }, 400);
            }
            const history = this.getMedicalHistoryByAnimalUseCase
                ? await this.getMedicalHistoryByAnimalUseCase.execute(animalId)
                : await this.listMedicalHistoriesUseCase.executeByAnimal(animalId);
            return c.json(history, 200);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 500;
            return handleControllerError(c, error, 'Error al listar historias médicas', status);
        }
    }
    /**
     * Crea un nuevo registro clínico enriquecido (HU8/HU9).
     */
    async create(c) {
        try {
            const params = c.req.param();
            const data = c.req.valid('json');
            const payload = c.get('jwtPayload');
            const animalId = params.animalId || params.id || data.animalId;
            if (!animalId) {
                return c.json({ error: 'Animal ID is required' }, 400);
            }
            const createdBy = payload?.sub || data.createdBy || 'system';
            const record = await this.createMedicalHistoryUseCase.execute({
                ...data,
                animalId,
                createdBy,
                date: data.date ? new Date(data.date) : new Date()
            });
            return c.json({
                message: 'Medical history entry added successfully',
                data: record
            }, 201);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al registrar historia médica', status);
        }
    }
    /**
     * Método retrocompatible para registrar historial médico.
     */
    async register(c) {
        return this.create(c);
    }
    /**
     * Actualiza un registro clínico con evolución, constantes o medidas (HU8/HU9).
     */
    async update(c) {
        try {
            const params = c.req.param();
            const recordId = params.historyId || params.id;
            if (!recordId) {
                return c.json({ error: 'Medical history ID is required' }, 400);
            }
            const data = c.req.valid('json');
            const updated = await this.updateMedicalHistoryUseCase.execute(recordId, data);
            return c.json({
                message: 'Medical history entry updated successfully',
                data: updated
            }, 200);
        }
        catch (error) {
            const status = error.message?.includes('not found') ? 404 : 400;
            return handleControllerError(c, error, 'Error al actualizar historia médica', status);
        }
    }
}
