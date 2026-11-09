import { RegisterAnimalUseCase } from '../../../../application/use-cases/Animal/RegisterAnimalUseCase.js';
import { GetAnimalByIdUseCase } from '../../../../application/use-cases/Animal/GetAnimalByIdUseCase.js';
import { ListAllAnimalsUseCase } from '../../../../application/use-cases/Animal/ListAllAnimalsUseCase.js';
import { UpdateAnimalUseCase } from '../../../../application/use-cases/Animal/UpdateAnimalUseCase.js';
import { DeleteAnimalUseCase } from '../../../../application/use-cases/Animal/DeleteAnimalUseCase.js';
import { TransferAnimalOwnershipUseCase } from '../../../../application/use-cases/Animal/TransferAnimalOwnershipUseCase.js';
import { SearchAnimalsUseCase } from '../../../../application/use-cases/Animal/SearchAnimalsUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
export class AnimalController {
    registerAnimalUseCase;
    getAnimalByIdUseCase;
    listAllAnimalsUseCase;
    updateAnimalUseCase;
    deleteAnimalUseCase;
    transferAnimalOwnershipUseCase;
    searchAnimalsUseCase;
    constructor(registerAnimalUseCase, getAnimalByIdUseCase, listAllAnimalsUseCase, updateAnimalUseCase, deleteAnimalUseCase, transferAnimalOwnershipUseCase, searchAnimalsUseCase) {
        this.registerAnimalUseCase = registerAnimalUseCase;
        this.getAnimalByIdUseCase = getAnimalByIdUseCase;
        this.listAllAnimalsUseCase = listAllAnimalsUseCase;
        this.updateAnimalUseCase = updateAnimalUseCase;
        this.deleteAnimalUseCase = deleteAnimalUseCase;
        this.transferAnimalOwnershipUseCase = transferAnimalOwnershipUseCase;
        this.searchAnimalsUseCase = searchAnimalsUseCase;
    }
    async register(c) {
        try {
            const data = c.req.valid('json');
            await this.registerAnimalUseCase.execute(data);
            return c.json({ message: 'Animal registered successfully' }, 201);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al registrar animal', 400);
        }
    }
    async getById(c) {
        try {
            const { id } = c.req.valid('param');
            const animal = await this.getAnimalByIdUseCase.execute(id);
            return c.json(animal);
        }
        catch (error) {
            return handleControllerError(c, error, 'Animal no encontrado', 404);
        }
    }
    async list(c) {
        try {
            const queryParams = (c.req.query ? c.req.query() : {});
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
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al listar animales', 500);
        }
    }
    async search(c) {
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
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al buscar animales', 500);
        }
    }
    async update(c) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.updateAnimalUseCase.execute(id, data);
            return c.json({ message: 'Animal updated successfully' });
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al actualizar animal', 400);
        }
    }
    async delete(c) {
        try {
            const { id } = c.req.valid('param');
            await this.deleteAnimalUseCase.execute(id);
            return c.json({ message: 'Animal deleted successfully' });
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al eliminar animal', 400);
        }
    }
    async transfer(c) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.transferAnimalOwnershipUseCase.execute({ animalId: id, newOwnerId: data.newOwnerId });
            return c.json({ message: 'Animal ownership transferred successfully' });
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al transferir propiedad del animal', 400);
        }
    }
}
