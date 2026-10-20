import { RegisterOwnerUseCase } from '../../../../application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '../../../../application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '../../../../application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '../../../../application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '../../../../application/use-cases/Owner/DeleteOwnerUseCase.js';
import { GetOwnerAnimalsUseCase as GetAnimalsByOwnerIdUseCase } from '../../../../application/use-cases/Animal/GetOwnerAnimalsUseCase.js';
import { GetOwnerAnimalsUseCase as GetOwnerAnimalsPortalUseCase } from '../../../../application/use-cases/Owner/GetOwnerAnimalsUseCase.js';
import { GetOwnerMedicalHistoryUseCase } from '../../../../application/use-cases/Owner/GetOwnerMedicalHistoryUseCase.js';
import { GetOwnerRemindersUseCase } from '../../../../application/use-cases/Owner/GetOwnerRemindersUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
export class OwnerController {
    registerOwnerUseCase;
    updateOwnerProfileUseCase;
    getOwnerByIdUseCase;
    listAllOwnersUseCase;
    deleteOwnerUseCase;
    getOwnerAnimalsUseCase;
    getOwnerAnimalsPortalUseCase;
    getOwnerMedicalHistoryUseCase;
    getOwnerRemindersUseCase;
    constructor(registerOwnerUseCase, updateOwnerProfileUseCase, getOwnerByIdUseCase, listAllOwnersUseCase, deleteOwnerUseCase, getOwnerAnimalsUseCase, getOwnerAnimalsPortalUseCase, getOwnerMedicalHistoryUseCase, getOwnerRemindersUseCase) {
        this.registerOwnerUseCase = registerOwnerUseCase;
        this.updateOwnerProfileUseCase = updateOwnerProfileUseCase;
        this.getOwnerByIdUseCase = getOwnerByIdUseCase;
        this.listAllOwnersUseCase = listAllOwnersUseCase;
        this.deleteOwnerUseCase = deleteOwnerUseCase;
        this.getOwnerAnimalsUseCase = getOwnerAnimalsUseCase;
        this.getOwnerAnimalsPortalUseCase = getOwnerAnimalsPortalUseCase;
        this.getOwnerMedicalHistoryUseCase = getOwnerMedicalHistoryUseCase;
        this.getOwnerRemindersUseCase = getOwnerRemindersUseCase;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async register(c) {
        try {
            const data = c.req.valid('json');
            const registeredId = await this.registerOwnerUseCase.execute(data);
            return c.json({ id: registeredId }, 201);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al registrar propietario', 400);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(c) {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');
            await this.updateOwnerProfileUseCase.execute(id, data);
            return c.json({ message: 'Owner updated successfully' });
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al actualizar propietario', 400);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getById(c) {
        try {
            const { id } = c.req.valid('param');
            const owner = await this.getOwnerByIdUseCase.execute(id);
            return c.json(owner);
        }
        catch (error) {
            return handleControllerError(c, error, 'Propietario no encontrado', 404);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async list(c) {
        try {
            const owners = await this.listAllOwnersUseCase.execute();
            return c.json(owners);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al listar propietarios', 500);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async delete(c) {
        try {
            const { id } = c.req.valid('param');
            await this.deleteOwnerUseCase.execute(id);
            return c.json({ message: 'Owner deleted successfully' });
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al eliminar propietario', 400);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAnimals(c) {
        try {
            const { id } = c.req.valid('param');
            const animals = await this.getOwnerAnimalsUseCase.execute(id);
            return c.json(animals);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al obtener animales del propietario', 400);
        }
    }
    // ─── Métodos del Portal del Propietario (Sprint 11) ───────────────────────
    /**
     * GET /owner/animals
     * Extrae el userId del token JWT autenticado y obtiene únicamente sus propios animales.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getOwnerAnimals(c) {
        if (!this.getOwnerAnimalsPortalUseCase) {
            return c.json({ error: 'Caso de uso GetOwnerAnimalsUseCase no configurado' }, 500);
        }
        const payload = c.get('jwtPayload');
        const userId = payload?.sub;
        if (!userId) {
            return c.json({ error: 'Usuario no autenticado o token JWT inválido' }, 401);
        }
        try {
            const animals = await this.getOwnerAnimalsPortalUseCase.execute(userId);
            return c.json(animals, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar animales propios', 500);
        }
    }
    /**
     * GET /owner/animals/:id/medical-history
     * Extrae el userId del JWT y el animalId del parámetro de ruta.
     * Valida la pertenencia del animal y retorna su historia clínica completa en modo solo lectura.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getOwnerAnimalMedicalHistory(c) {
        if (!this.getOwnerMedicalHistoryUseCase) {
            return c.json({ error: 'Caso de uso GetOwnerMedicalHistoryUseCase no configurado' }, 500);
        }
        const payload = c.get('jwtPayload');
        const userId = payload?.sub;
        if (!userId) {
            return c.json({ error: 'Usuario no autenticado o token JWT inválido' }, 401);
        }
        const params = c.req.param();
        const animalId = params['animalId'] ?? params['id'];
        if (!animalId) {
            return c.json({ error: 'Identificador del animal no proporcionado' }, 400);
        }
        try {
            const medicalHistory = await this.getOwnerMedicalHistoryUseCase.execute(userId, animalId);
            return c.json(medicalHistory, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar historia clínica', 500);
        }
    }
    /**
     * GET /owner/reminders
     * Sprint 16 (HU7 / ASIDGA-172 a ASIDGA-174):
     * Extrae el userId del JWT y unifica los recordatorios pendientes de vacunas, citas y alimentación.
     * Soporta parámetro opcional de consulta animalId.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getOwnerReminders(c) {
        if (!this.getOwnerRemindersUseCase) {
            return c.json({ error: 'Caso de uso GetOwnerRemindersUseCase no configurado' }, 500);
        }
        const payload = c.get('jwtPayload');
        const userId = payload?.sub;
        if (!userId) {
            return c.json({ error: 'Usuario no autenticado o token JWT inválido' }, 401);
        }
        // Obtener parámetro de consulta opcional animalId
        const query = c.req.valid('query');
        const animalId = query?.animalId ?? c.req.query('animalId');
        try {
            const reminders = await this.getOwnerRemindersUseCase.execute(userId, { animalId });
            return c.json(reminders, 200);
        }
        catch (error) {
            return handleControllerError(c, error, 'Error al consultar recordatorios', 500);
        }
    }
}
