import type { Context } from 'hono';
import { RegisterAnimalUseCase } from '@application/use-cases/Animal/RegisterAnimalUseCase.js';
import { GetAnimalByIdUseCase } from '@application/use-cases/Animal/GetAnimalByIdUseCase.js';
import { ListAllAnimalsUseCase } from '@application/use-cases/Animal/ListAllAnimalsUseCase.js';
import { UpdateAnimalUseCase } from '@application/use-cases/Animal/UpdateAnimalUseCase.js';
import { DeleteAnimalUseCase } from '@application/use-cases/Animal/DeleteAnimalUseCase.js';
import { TransferAnimalOwnershipUseCase } from '@application/use-cases/Animal/TransferAnimalOwnershipUseCase.js';

export class AnimalController {
    constructor(
        private registerAnimalUseCase: RegisterAnimalUseCase,
        private getAnimalByIdUseCase: GetAnimalByIdUseCase,
        private listAllAnimalsUseCase: ListAllAnimalsUseCase,
        private updateAnimalUseCase: UpdateAnimalUseCase,
        private deleteAnimalUseCase: DeleteAnimalUseCase,
        private transferAnimalOwnershipUseCase: TransferAnimalOwnershipUseCase
    ) { }

    async register(c: Context) {
        const data = await c.req.json();
        try {
            await this.registerAnimalUseCase.execute(data);
            return c.json({ message: 'Animal registered successfully' }, 201);
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
            const animal = await this.getAnimalByIdUseCase.execute(id);
            return c.json(animal);
        } catch (error: any) {
            return c.json({ error: error.message }, 404);
        }
    }

    async list(c: Context) {
        try {
            const animals = await this.listAllAnimalsUseCase.execute();
            return c.json(animals);
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    }

    async update(c: Context) {
        const id = c.req.param('id');
        const data = await c.req.json();

        if (!id) {
            throw new Error("no id provided")
        }
        try {
            await this.updateAnimalUseCase.execute(id, data);
            return c.json({ message: 'Animal updated successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async delete(c: Context) {
        const id = c.req.param('id');
        if (!id) {
            throw new Error("no id provided");
        }
        try {
            await this.deleteAnimalUseCase.execute(id);
            return c.json({ message: 'Animal deleted successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }

    async transfer(c: Context) {
        const id = c.req.param('id');
        const data = await c.req.json();

        if (!id) {
            throw new Error("no id provided");
        }

        try {
            await this.transferAnimalOwnershipUseCase.execute({ animalId: id, newOwnerId: data.newOwnerId });
            return c.json({ message: 'Animal ownership transferred successfully' });
        } catch (error: any) {
            return c.json({ error: error.message }, 400);
        }
    }
}
