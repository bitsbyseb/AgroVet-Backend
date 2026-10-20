import { RegisterAnimalUseCase } from '@application/use-cases/Animal/RegisterAnimalUseCase.js';
import { GetAnimalByIdUseCase } from '@application/use-cases/Animal/GetAnimalByIdUseCase.js';
import { ListAllAnimalsUseCase } from '@application/use-cases/Animal/ListAllAnimalsUseCase.js';
import { UpdateAnimalUseCase } from '@application/use-cases/Animal/UpdateAnimalUseCase.js';
import { DeleteAnimalUseCase } from '@application/use-cases/Animal/DeleteAnimalUseCase.js';
import { TransferAnimalOwnershipUseCase } from '@application/use-cases/Animal/TransferAnimalOwnershipUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class AnimalController {
    constructor(
        private registerAnimalUseCase: RegisterAnimalUseCase,
        private getAnimalByIdUseCase: GetAnimalByIdUseCase,
        private listAllAnimalsUseCase: ListAllAnimalsUseCase,
        private updateAnimalUseCase: UpdateAnimalUseCase,
        private deleteAnimalUseCase: DeleteAnimalUseCase,
        private transferAnimalOwnershipUseCase: TransferAnimalOwnershipUseCase
    ) { }

    async register(c: any) {
        try {
            const data = c.req.valid('json');
            await this.registerAnimalUseCase.execute(data);
            return c.json({ message: 'Animal registered successfully' }, 201);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al registrar animal', 400);
        }
    }

    async getById(c: any) {
        try {
            const { id } = c.req.valid('param');
            const animal = await this.getAnimalByIdUseCase.execute(id);
            return c.json(animal);
        } catch (error: any) {
            return handleControllerError(c, error, 'Animal no encontrado', 404);
        }
    }

    async list(c: any) {
        try {
            const animals = await this.listAllAnimalsUseCase.execute();
            return c.json(animals);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al listar animales', 500);
        }
    }

    async update(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.updateAnimalUseCase.execute(id, data);
            return c.json({ message: 'Animal updated successfully' });
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al actualizar animal', 400);
        }
    }

    async delete(c: any) {
        try {
            const { id } = c.req.valid('param');
            await this.deleteAnimalUseCase.execute(id);
            return c.json({ message: 'Animal deleted successfully' });
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al eliminar animal', 400);
        }
    }

    async transfer(c: any) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.transferAnimalOwnershipUseCase.execute({ animalId: id, newOwnerId: data.newOwnerId });
            return c.json({ message: 'Animal ownership transferred successfully' });
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al transferir propiedad del animal', 400);
        }
    }
}
