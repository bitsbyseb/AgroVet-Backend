import type { Context } from 'hono';
import { RegisterOwnerUseCase } from '@application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '@application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '@application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '@application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '@application/use-cases/Owner/DeleteOwnerUseCase.js';
import { GetOwnerAnimalsUseCase } from '@application/use-cases/Animal/GetOwnerAnimalsUseCase.js';
import type { ownerCreationType, ownerUpdateType } from '../validators/OwnerValidator.js';

export class OwnerController {
    constructor(
        private registerOwnerUseCase: RegisterOwnerUseCase,
        private updateOwnerProfileUseCase: UpdateOwnerProfileUseCase,
        private getOwnerByIdUseCase: GetOwnerByIdUseCase,
        private listAllOwnersUseCase: ListAllOwnersUseCase,
        private deleteOwnerUseCase: DeleteOwnerUseCase,
        private getOwnerAnimalsUseCase: GetOwnerAnimalsUseCase
    ) { }

    async register(c: Context) {
        const data:ownerCreationType = await c.req.json();
        try {
            await this.registerOwnerUseCase.execute(data);
            return c.json({ message: 'Owner registered successfully' }, 201);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async update(c: Context) {
        const id = c.req.param('id');
        const data:ownerUpdateType = await c.req.json();

        if (!id) {
            throw new Error("no id provided");
        }
        try {
            await this.updateOwnerProfileUseCase.execute(id, data);
            return c.json({ message: 'Owner updated successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getById(c: Context) {
        const id = c.req.param('id');

        if (!id) {
            throw new Error("no id provided");
        }
        try {
            const owner = await this.getOwnerByIdUseCase.execute(id);
            return c.json(owner);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }

    async list(c: Context) {
        try {
            const owners = await this.listAllOwnersUseCase.execute();
            return c.json(owners);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }

    async delete(c: Context) {
        const id = c.req.param('id');

        if (!id) {
            throw new Error("no id provided");
        }
        try {
            await this.deleteOwnerUseCase.execute(id);
            return c.json({ message: 'Owner deleted successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async getAnimals(c: Context) {
        const id = c.req.param('id');
        if (!id) {
            throw new Error("no id provided");
        }
        try {
            const animals = await this.getOwnerAnimalsUseCase.execute(id);
            return c.json(animals);
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
