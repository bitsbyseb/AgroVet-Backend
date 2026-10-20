import type { Context } from 'hono';
import { RegisterOwnerUseCase } from '@application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '@application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '@application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '@application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '@application/use-cases/Owner/DeleteOwnerUseCase.js';
import { GetOwnerAnimalsUseCase as GetAnimalsByOwnerIdUseCase } from '@application/use-cases/Animal/GetOwnerAnimalsUseCase.js';
import { GetOwnerAnimalsUseCase as GetOwnerAnimalsPortalUseCase } from '@application/use-cases/Owner/GetOwnerAnimalsUseCase.js';
import { GetOwnerMedicalHistoryUseCase } from '@application/use-cases/Owner/GetOwnerMedicalHistoryUseCase.js';
import { GetOwnerRemindersUseCase } from '@application/use-cases/Owner/GetOwnerRemindersUseCase.js';
import { handleControllerError } from '../utils/errorHandler.js';
import type { OwnerType } from '@domain/entities/Owner.js';

interface JwtPayload {
    sub: string;
    role: string;
    exp?: number;
    iat?: number;
}

export class OwnerController {
    constructor(
        private registerOwnerUseCase: RegisterOwnerUseCase,
        private updateOwnerProfileUseCase: UpdateOwnerProfileUseCase,
        private getOwnerByIdUseCase: GetOwnerByIdUseCase,
        private listAllOwnersUseCase: ListAllOwnersUseCase,
        private deleteOwnerUseCase: DeleteOwnerUseCase,
        private getOwnerAnimalsUseCase: GetAnimalsByOwnerIdUseCase,
        private getOwnerAnimalsPortalUseCase?: GetOwnerAnimalsPortalUseCase,
        private getOwnerMedicalHistoryUseCase?: GetOwnerMedicalHistoryUseCase,
        private getOwnerRemindersUseCase?: GetOwnerRemindersUseCase
    ) { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async register(c: Context): Promise<any> {
        try {
            const data = c.req.valid('json' as never) as {
                name: string;
                document: string;
                phone: string;
                email: string;
                address: string;
                ownerType: OwnerType;
            };
            const registeredId = await this.registerOwnerUseCase.execute(data);
            return c.json({ id: registeredId }, 201);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al registrar propietario', 400);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(c: Context): Promise<any> {
        try {
            const { id } = c.req.valid('param' as never) as { id: string };
            const data = c.req.valid('json' as never) as {
                name?: string;
                phone?: string;
                email?: string;
                address?: string;
                ownerType?: OwnerType;
            };
            await this.updateOwnerProfileUseCase.execute(id, data);
            return c.json({ message: 'Owner updated successfully' });
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al actualizar propietario', 400);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getById(c: Context): Promise<any> {
        try {
            const { id } = c.req.valid('param' as never) as { id: string };
            const owner = await this.getOwnerByIdUseCase.execute(id);
            return c.json(owner);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Propietario no encontrado', 404);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async list(c: Context): Promise<any> {
        try {
            const owners = await this.listAllOwnersUseCase.execute();
            return c.json(owners);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al listar propietarios', 500);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async delete(c: Context): Promise<any> {
        try {
            const { id } = c.req.valid('param' as never) as { id: string };
            await this.deleteOwnerUseCase.execute(id);
            return c.json({ message: 'Owner deleted successfully' });
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al eliminar propietario', 400);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAnimals(c: Context): Promise<any> {
        try {
            const { id } = c.req.valid('param' as never) as { id: string };
            const animals = await this.getOwnerAnimalsUseCase.execute(id);
            return c.json(animals);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al obtener animales del propietario', 400);
        }
    }

    // ─── Métodos del Portal del Propietario (Sprint 11) ───────────────────────

    /**
     * GET /owner/animals
     * Extrae el userId del token JWT autenticado y obtiene únicamente sus propios animales.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getOwnerAnimals(c: Context): Promise<any> {
        if (!this.getOwnerAnimalsPortalUseCase) {
            return c.json({ error: 'Caso de uso GetOwnerAnimalsUseCase no configurado' }, 500);
        }

        const payload = c.get('jwtPayload') as JwtPayload | undefined;
        const userId = payload?.sub;

        if (!userId) {
            return c.json({ error: 'Usuario no autenticado o token JWT inválido' }, 401);
        }

        try {
            const animals = await this.getOwnerAnimalsPortalUseCase.execute(userId);
            return c.json(animals, 200);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al consultar animales propios', 500);
        }
    }

    /**
     * GET /owner/animals/:id/medical-history
     * Extrae el userId del JWT y el animalId del parámetro de ruta.
     * Valida la pertenencia del animal y retorna su historia clínica completa en modo solo lectura.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getOwnerAnimalMedicalHistory(c: Context): Promise<any> {
        if (!this.getOwnerMedicalHistoryUseCase) {
            return c.json({ error: 'Caso de uso GetOwnerMedicalHistoryUseCase no configurado' }, 500);
        }

        const payload = c.get('jwtPayload') as JwtPayload | undefined;
        const userId = payload?.sub;

        if (!userId) {
            return c.json({ error: 'Usuario no autenticado o token JWT inválido' }, 401);
        }

        const params = c.req.param() as Record<string, string>;
        const animalId = params['animalId'] ?? params['id'];

        if (!animalId) {
            return c.json({ error: 'Identificador del animal no proporcionado' }, 400);
        }

        try {
            const medicalHistory = await this.getOwnerMedicalHistoryUseCase.execute(userId, animalId);
            return c.json(medicalHistory, 200);
        } catch (error: unknown) {
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
    async getOwnerReminders(c: Context): Promise<any> {
        if (!this.getOwnerRemindersUseCase) {
            return c.json({ error: 'Caso de uso GetOwnerRemindersUseCase no configurado' }, 500);
        }

        const payload = c.get('jwtPayload') as JwtPayload | undefined;
        const userId = payload?.sub;

        if (!userId) {
            return c.json({ error: 'Usuario no autenticado o token JWT inválido' }, 401);
        }

        // Obtener parámetro de consulta opcional animalId
        const query = c.req.valid('query' as never) as { animalId?: string } | undefined;
        const animalId = query?.animalId ?? c.req.query('animalId');

        try {
            const reminders = await this.getOwnerRemindersUseCase.execute(userId, { animalId });
            return c.json(reminders, 200);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al consultar recordatorios', 500);
        }
    }
}
