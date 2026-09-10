import { RegisterOwnerUseCase } from '../../../../application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '../../../../application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '../../../../application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '../../../../application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '../../../../application/use-cases/Owner/DeleteOwnerUseCase.js';
import { GetOwnerAnimalsUseCase } from '../../../../application/use-cases/Animal/GetOwnerAnimalsUseCase.js';
export class OwnerController {
    registerOwnerUseCase;
    updateOwnerProfileUseCase;
    getOwnerByIdUseCase;
    listAllOwnersUseCase;
    deleteOwnerUseCase;
    getOwnerAnimalsUseCase;
    constructor(registerOwnerUseCase, updateOwnerProfileUseCase, getOwnerByIdUseCase, listAllOwnersUseCase, deleteOwnerUseCase, getOwnerAnimalsUseCase) {
        this.registerOwnerUseCase = registerOwnerUseCase;
        this.updateOwnerProfileUseCase = updateOwnerProfileUseCase;
        this.getOwnerByIdUseCase = getOwnerByIdUseCase;
        this.listAllOwnersUseCase = listAllOwnersUseCase;
        this.deleteOwnerUseCase = deleteOwnerUseCase;
        this.getOwnerAnimalsUseCase = getOwnerAnimalsUseCase;
    }
    async register(c) {
        const data = c.req.valid('json');
        try {
            const registeredId = await this.registerOwnerUseCase.execute(data);
            return c.json({ id: registeredId }, 201);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async update(c) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            await this.updateOwnerProfileUseCase.execute(id, data);
            return c.json({ message: 'Owner updated successfully' });
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async getById(c) {
        const { id } = c.req.valid('param');
        try {
            const owner = await this.getOwnerByIdUseCase.execute(id);
            return c.json(owner);
        }
        catch (error) {
            return c.json({ error: error.message }, 404);
        }
    }
    async list(c) {
        try {
            const owners = await this.listAllOwnersUseCase.execute();
            return c.json(owners);
        }
        catch (error) {
            return c.json({ error: error.message }, 500);
        }
    }
    async delete(c) {
        const { id } = c.req.valid('param');
        try {
            await this.deleteOwnerUseCase.execute(id);
            return c.json({ message: 'Owner deleted successfully' });
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
    async getAnimals(c) {
        const { id } = c.req.valid('param');
        try {
            const animals = await this.getOwnerAnimalsUseCase.execute(id);
            return c.json(animals);
        }
        catch (error) {
            return c.json({ error: error.message }, 400);
        }
    }
}
