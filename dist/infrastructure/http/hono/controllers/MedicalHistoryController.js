import { RegisterMedicalHistoryUseCase } from '../../../../application/use-cases/MedicalHistory/RegisterMedicalHistoryUseCase.js';
import { ListMedicalHistoriesUseCase } from '../../../../application/use-cases/MedicalHistory/ListMedicalHistoriesUseCase.js';
export class MedicalHistoryController {
    registerMedicalHistoryUseCase;
    listMedicalHistoriesUseCase;
    constructor(registerMedicalHistoryUseCase, listMedicalHistoriesUseCase) {
        this.registerMedicalHistoryUseCase = registerMedicalHistoryUseCase;
        this.listMedicalHistoriesUseCase = listMedicalHistoriesUseCase;
    }
    async listByAnimal(c) {
        const { id } = c.req.valid('param');
        try {
            const history = await this.listMedicalHistoriesUseCase.executeByAnimal(id);
            return c.json(history);
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    }
    async register(c) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        const payload = c.get('jwtPayload');
        try {
            await this.registerMedicalHistoryUseCase.execute({
                ...data,
                animalId: id,
                createdBy: payload.sub,
                date: new Date(data.date)
            });
            return c.json({ message: 'Medical history entry added successfully' }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
}
