import { RegisterPaddockUseCase } from '../../../../application/use-cases/paddocks/RegisterPaddockUseCase.js';
import { GetPaddocksUseCase } from '../../../../application/use-cases/paddocks/GetPaddocksUseCase.js';
import { UpdatePaddockUseCase } from '../../../../application/use-cases/paddocks/UpdatePaddockUseCase.js';
import { randomUUID } from 'node:crypto';
import { handleControllerError } from '../utils/errorHandler.js';
export class PaddockController {
    registerPaddockUseCase;
    getPaddocksUseCase;
    updatePaddockUseCase;
    constructor(registerPaddockUseCase, getPaddocksUseCase, updatePaddockUseCase) {
        this.registerPaddockUseCase = registerPaddockUseCase;
        this.getPaddocksUseCase = getPaddocksUseCase;
        this.updatePaddockUseCase = updatePaddockUseCase;
    }
    async register(c) {
        try {
            const data = c.req.valid('json');
            const id = randomUUID();
            await this.registerPaddockUseCase.execute({
                id,
                ...data
            });
            return c.json({ message: 'Paddock registered successfully', id }, 201);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al registrar potrero', 400);
        }
    }
    async list(c) {
        try {
            const paddocks = await this.getPaddocksUseCase.execute();
            return c.json(paddocks, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al listar potreros', 500);
        }
    }
    async getById(c) {
        try {
            const { id } = c.req.valid('param');
            const paddock = await this.getPaddocksUseCase.getById(id);
            if (!paddock) {
                return c.json({ error: 'Paddock not found' }, 404);
            }
            return c.json(paddock, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar potrero', 500);
        }
    }
    async update(c) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.updatePaddockUseCase.execute(id, data);
            return c.json({ message: 'Paddock updated successfully' }, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al actualizar potrero', 400);
        }
    }
}
