import { RegisterVaccinationUseCase } from '../../../../application/use-cases/Vaccination/RegisterVaccinationUseCase.js';
import { ListVaccinationsUseCase } from '../../../../application/use-cases/Vaccination/ListVaccinationsUseCase.js';
export class VaccinationController {
    registerVaccinationUseCase;
    listVaccinationsUseCase;
    constructor(registerVaccinationUseCase, listVaccinationsUseCase) {
        this.registerVaccinationUseCase = registerVaccinationUseCase;
        this.listVaccinationsUseCase = listVaccinationsUseCase;
    }
    async listByAnimal(c) {
        const { id } = c.req.valid('param');
        try {
            const vaccines = await this.listVaccinationsUseCase.executeByAnimal(id);
            return c.json(vaccines);
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
            return c.json({ error: error.message }, 400);
        }
    }
}
