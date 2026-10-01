/**
 * Controlador del Portal del Propietario (Sprint 11).
 *
 * Todas las acciones de este controlador son de solo lectura.
 * El userId se extrae del payload JWT validado por authMiddleware
 * (disponible en `c.get('jwtPayload').sub`), por lo que no se
 * acepta ningún parámetro externo para identificar al propietario.
 */
export class OwnerPortalController {
    getOwnerAnimalsUseCase;
    getOwnerMedicalHistoryUseCase;
    constructor(getOwnerAnimalsUseCase, getOwnerMedicalHistoryUseCase) {
        this.getOwnerAnimalsUseCase = getOwnerAnimalsUseCase;
        this.getOwnerMedicalHistoryUseCase = getOwnerMedicalHistoryUseCase;
    }
    /**
     * GET /api/v1/owner/animals
     *
     * Retorna la lista de animales que pertenecen al propietario autenticado.
     * El userId se obtiene del `sub` del token JWT — no se expone ningún parámetro
     * que permita consultar animales de otro propietario.
     */
    async getOwnerAnimals(c) {
        const payload = c.get('jwtPayload');
        try {
            const animals = await this.getOwnerAnimalsUseCase.execute(payload.sub);
            return c.json(animals, 200);
        }
        catch (error) {
            if (error.message.includes('perfil de propietario')) {
                return c.json({ error: error.message }, 404);
            }
            return c.json({ error: error.message }, 500);
        }
    }
    /**
     * GET /api/v1/owner/animals/:animalId/medical-history
     *
     * Retorna el historial clínico completo del animal indicado, siempre que
     * pertenezca al propietario autenticado. Si el animal no le pertenece,
     * el caso de uso lanza un error que se serializa como 403.
     */
    async getOwnerAnimalMedicalHistory(c) {
        const payload = c.get('jwtPayload');
        const { animalId } = c.req.valid('param');
        try {
            const history = await this.getOwnerMedicalHistoryUseCase.execute(payload.sub, animalId);
            return c.json(history, 200);
        }
        catch (error) {
            if (error.message.includes('Acceso no autorizado')) {
                return c.json({ error: error.message }, 403);
            }
            if (error.message.includes('no fue encontrado')) {
                return c.json({ error: error.message }, 404);
            }
            if (error.message.includes('perfil de propietario')) {
                return c.json({ error: error.message }, 404);
            }
            return c.json({ error: error.message }, 500);
        }
    }
}
