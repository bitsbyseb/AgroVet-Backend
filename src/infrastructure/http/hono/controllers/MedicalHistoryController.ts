import { RegisterMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/RegisterMedicalHistoryUseCase.js';
import { ListMedicalHistoriesUseCase } from '@application/use-cases/MedicalHistory/ListMedicalHistoriesUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class MedicalHistoryController {
    constructor(
        private registerMedicalHistoryUseCase: RegisterMedicalHistoryUseCase,
        private listMedicalHistoriesUseCase: ListMedicalHistoriesUseCase
    ) { }

    async listByAnimal(c: any) {
        try {
            const { id } = c.req.valid('param');
            const history = await this.listMedicalHistoriesUseCase.executeByAnimal(id);
            return c.json(history);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al listar historias médicas', 500);
        }
    }

    async register(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            const payload = c.get('jwtPayload');
            await this.registerMedicalHistoryUseCase.execute({ 
                ...data, 
                animalId: id,
                createdBy: payload.sub,
                date: new Date(data.date)
            });
            return c.json({ message: 'Medical history entry added successfully' }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar historia médica', 400);
        }
    }
}
