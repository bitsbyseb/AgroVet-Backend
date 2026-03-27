import type { Context } from 'hono';
import { RegisterVaccinationUseCase } from '@application/use-cases/Vaccination/RegisterVaccinationUseCase.js';
import { ListVaccinationsUseCase } from '@application/use-cases/Vaccination/ListVaccinationsUseCase.js';

export class VaccinationController {
    constructor(
        private registerVaccinationUseCase: RegisterVaccinationUseCase,
        private listVaccinationsUseCase: ListVaccinationsUseCase
    ) { }

    async listByAnimal(c: Context) {
        const animalId = c.req.param('id');
        try {
            if (!animalId) {
                throw new Error("undefined id");
            }

            const vaccines = await this.listVaccinationsUseCase.executeByAnimal(animalId);
            return c.json(vaccines);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }

    async register(c: Context) {
        const animalId = c.req.param('id');
        const data = await c.req.json();
        try {
            await this.registerVaccinationUseCase.execute({ ...data, animalId });
            return c.json({ message: 'Vaccination record added successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
