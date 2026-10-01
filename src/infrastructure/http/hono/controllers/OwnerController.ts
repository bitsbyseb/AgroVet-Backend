import type { Context } from 'hono';
import { RegisterOwnerUseCase } from '@application/use-cases/Owner/RegisterOwnerUseCase.js';
import { UpdateOwnerProfileUseCase } from '@application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { GetOwnerByIdUseCase } from '@application/use-cases/Owner/GetOwnerByIdUseCase.js';
import { ListAllOwnersUseCase } from '@application/use-cases/Owner/ListAllOwnersUseCase.js';
import { DeleteOwnerUseCase } from '@application/use-cases/Owner/DeleteOwnerUseCase.js';
import { GetOwnerAnimalsUseCase as GetAnimalsByOwnerIdUseCase } from '@application/use-cases/Animal/GetOwnerAnimalsUseCase.js';
import { GetOwnerAnimalsUseCase as GetOwnerAnimalsPortalUseCase } from '@application/use-cases/Owner/GetOwnerAnimalsUseCase.js';
import { GetOwnerMedicalHistoryUseCase } from '@application/use-cases/Owner/GetOwnerMedicalHistoryUseCase.js';
import type { ownerCreationType, ownerUpdateType } from '../validators/OwnerValidator.js';

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
        private getOwnerMedicalHistoryUseCase?: GetOwnerMedicalHistoryUseCase
    ) { }

    async register(c: any) {
        const data = c.req.valid('json');
        try {
            const registeredId = await this.registerOwnerUseCase.execute(data);
            return c.json({ id: registeredId }, 201);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido al registrar propietario';
            return c.json({ error: message }, 400);
        }
    }

    async update(c: any) {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        try {
            await this.updateOwnerProfileUseCase.execute(id, data);
            return c.json({ message: 'Owner updated successfully' });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido al actualizar propietario';
            return c.json({ error: message }, 400);
        }
    }

    async getById(c: any) {
        const { id } = c.req.valid('param');
        try {
            const owner = await this.getOwnerByIdUseCase.execute(id);
            return c.json(owner);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Propietario no encontrado';
            return c.json({ error: message }, 404);
        }
    }

    async list(c: any) {
        try {
            const owners = await this.listAllOwnersUseCase.execute();
            return c.json(owners);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al listar propietarios';
            return c.json({ error: message }, 500);
        }
    }

    async delete(c: any) {
        const { id } = c.req.valid('param');
        try {
            await this.deleteOwnerUseCase.execute(id);
            return c.json({ message: 'Owner deleted successfully' });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al eliminar propietario';
            return c.json({ error: message }, 400);
        }
    }

    async getAnimals(c: any) {
        const { id } = c.req.valid('param');
        try {
            const animals = await this.getOwnerAnimalsUseCase.execute(id);
            return c.json(animals);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al obtener animales del propietario';
            return c.json({ error: message }, 400);
        }
    }

    // ─── Métodos del Portal del Propietario (Sprint 11) ───────────────────────

    /**
     * GET /owner/animals
     * Extrae el userId del token JWT autenticado y obtiene únicamente sus propios animales.
     */
    async getOwnerAnimals(c: Context) {
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
            const message = error instanceof Error ? error.message : 'Error al consultar animales propios';
            if (message.includes('perfil de propietario')) {
                return c.json({ error: message }, 404);
            }
            return c.json({ error: message }, 500);
        }
    }

    /**
     * GET /owner/animals/:id/medical-history
     * Extrae el userId del JWT y el animalId del parámetro de ruta.
     * Valida la pertenencia del animal y retorna su historia clínica completa en modo solo lectura.
     */
    async getOwnerAnimalMedicalHistory(c: Context) {
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
            const message = error instanceof Error ? error.message : 'Error al consultar historia clínica';
            if (message.includes('Acceso no autorizado')) {
                return c.json({ error: message }, 403);
            }
            if (message.includes('no fue encontrado') || message.includes('perfil de propietario')) {
                return c.json({ error: message }, 404);
            }
            return c.json({ error: message }, 500);
        }
    }
}
