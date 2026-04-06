import { RegisterOwnerUseCase } from '@application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '@application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '@application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '@application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '@application/use-cases/Owner/DeleteOwnerUseCase.js';
import { GetOwnerAnimalsUseCase } from '@application/use-cases/Animal/GetOwnerAnimalsUseCase.js';

export class OwnerController {
    constructor(
        private registerOwnerUseCase: RegisterOwnerUseCase,
        private updateOwnerProfileUseCase: UpdateOwnerProfileUseCase,
        private getOwnerByIdUseCase: GetOwnerByIdUseCase,
        private listAllOwnersUseCase: ListAllOwnersUseCase,
        private deleteOwnerUseCase: DeleteOwnerUseCase,
        private getOwnerAnimalsUseCase: GetOwnerAnimalsUseCase
    ) { }

    async register(c: any) {
        const data = c.req.valid('json');
        try {
            await this.registerOwnerUseCase.execute(data);
            return c.json({ message: 'Owner registered successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async update(c: any) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            await this.updateOwnerProfileUseCase.execute(id, data);
            return c.json({ message: 'Owner updated successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getById(c: any) {
        const { id } = c.req.valid('param');
        try {
            const owner = await this.getOwnerByIdUseCase.execute(id);
            return c.json(owner);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }

    async list(c: any) {
        try {
            const owners = await this.listAllOwnersUseCase.execute();
            return c.json(owners);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }

    async delete(c: any) {
        const { id } = c.req.valid('param');
        try {
            await this.deleteOwnerUseCase.execute(id);
            return c.json({ message: 'Owner deleted successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getAnimals(c: any) {
        const { id } = c.req.valid('param');
        try {
            const animals = await this.getOwnerAnimalsUseCase.execute(id);
            return c.json(animals);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
