import { RegisterVaccinationUseCase } from '../../../../application/use-cases/Vaccination/RegisterVaccinationUseCase.js';
import { ListVaccinationsUseCase } from '../../../../application/use-cases/Vaccination/ListVaccinationsUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
export class VaccinationController {
    registerVaccinationUseCase;
    listVaccinationsUseCase;
    constructor(registerVaccinationUseCase, listVaccinationsUseCase) {
        this.registerVaccinationUseCase = registerVaccinationUseCase;
        this.listVaccinationsUseCase = listVaccinationsUseCase;
    }
    async listByAnimal(c) {
        try {
            const { id } = c.req.valid('param');
            const vaccines = await this.listVaccinationsUseCase.executeByAnimal(id);
            return c.json(vaccines);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al listar vacunas', 500);
        }
    }
    async register(c) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            const payload = c.get('jwtPayload');
            await this.registerVaccinationUseCase.execute({
                ...data,
                animalId: id,
                administeredBy: payload.sub,
                applicationDate: new Date(data.applicationDate),
                nextDoseDate: data.nextDoseDate ? new Date(data.nextDoseDate) : null
            });
            return c.json({ message: 'vacunacion registrada con exito' }, 201);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al registrar vacunación', 400);
        }
    }
}
