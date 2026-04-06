import { RegisterVaccinationUseCase } from '@application/use-cases/Vaccination/RegisterVaccinationUseCase.js';
import { ListVaccinationsUseCase } from '@application/use-cases/Vaccination/ListVaccinationsUseCase.js';

export class VaccinationController {
    constructor(
        private registerVaccinationUseCase: RegisterVaccinationUseCase,
        private listVaccinationsUseCase: ListVaccinationsUseCase
    ) { }

    async listByAnimal(c: any) {
        const { id } = c.req.valid('param');
        try {
            const vaccines = await this.listVaccinationsUseCase.executeByAnimal(id);
            return c.json(vaccines);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }

    async register(c: any) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            await this.registerVaccinationUseCase.execute({ ...data, animalId: id });
            return c.json({ message: 'Vaccination record added successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
