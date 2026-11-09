import { RegisterAnimalUseCase } from '@application/use-cases/Animal/RegisterAnimalUseCase.js';
import { GetAnimalByIdUseCase } from '@application/use-cases/Animal/GetAnimalByIdUseCase.js';
import { ListAllAnimalsUseCase } from '@application/use-cases/Animal/ListAllAnimalsUseCase.js';
import { UpdateAnimalUseCase } from '@application/use-cases/Animal/UpdateAnimalUseCase.js';
import { DeleteAnimalUseCase } from '@application/use-cases/Animal/DeleteAnimalUseCase.js';
import { TransferAnimalOwnershipUseCase } from '@application/use-cases/Animal/TransferAnimalOwnershipUseCase.js';
import { SearchAnimalsUseCase } from '@application/use-cases/Animal/SearchAnimalsUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';

export class AnimalController {
    constructor(
        private registerAnimalUseCase: RegisterAnimalUseCase,
        private getAnimalByIdUseCase: GetAnimalByIdUseCase,
        private listAllAnimalsUseCase: ListAllAnimalsUseCase,
        private updateAnimalUseCase: UpdateAnimalUseCase,
        private deleteAnimalUseCase: DeleteAnimalUseCase,
        private transferAnimalOwnershipUseCase: TransferAnimalOwnershipUseCase,
        private searchAnimalsUseCase?: SearchAnimalsUseCase
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
            const queryParams = (c.req.query ? c.req.query() : {}) as Record<string, string>;
            const query = queryParams.query || queryParams.q;
            const name = queryParams.name;
            const identification = queryParams.identification;
            const species = queryParams.species;
            const ownerId = queryParams.ownerId;
            const status = queryParams.status;

            if ((query || name || identification || species || ownerId || status) && this.searchAnimalsUseCase) {
                const animals = await this.searchAnimalsUseCase.execute({
                    query,
                    name,
                    identification,
                    species,
                    ownerId,
                    status
                });
                return c.json(animals);
            }

            const animals = await this.listAllAnimalsUseCase.execute();
            return c.json(animals);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al listar animales', 500);
        }
    }

    async search(c: any) {
        try {
            const queryParams = c.req.valid('query') || {};
            const query = queryParams.query || queryParams.q;
            const name = queryParams.name;
            const identification = queryParams.identification;
            const species = queryParams.species;
            const ownerId = queryParams.ownerId;
            const status = queryParams.status;

            if (!this.searchAnimalsUseCase) {
                const animals = await this.listAllAnimalsUseCase.execute();
                return c.json(animals);
            }

            const animals = await this.searchAnimalsUseCase.execute({
                query,
                name,
                identification,
                species,
                ownerId,
                status
            });
            return c.json(animals);
        } catch (error: any) {
            return handleControllerError(c, error, 'Error al buscar animales', 500);
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
