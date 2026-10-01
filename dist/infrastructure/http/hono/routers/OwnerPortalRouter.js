import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { OwnerPortalController } from '../controllers/OwnerPortalController.js';
import { ownerPortalAnimalParamsSchema, ownerPortalAnimalsResponseSchema, ownerPortalMedicalHistoryResponseSchema } from '../validators/OwnerValidator.js';
const errorSchema = z.object({ error: z.string() });
/**
 * Router del Portal del Propietario (Sprint 11).
 *
 * Prefijo de montaje: /api/v1/owner
 *
 * Rutas expuestas:
 *   GET /owner/animals                            → Lista de animales propios
 *   GET /owner/animals/:animalId/medical-history  → Historia clínica de un animal propio
 *
 * Seguridad:
 *   - authMiddleware: verifica y decodifica el JWT en todas las rutas del router.
 *   - rbacMiddleware('portal_propietario'): garantiza que solo el rol OWNER pueda
 *     acceder. Cualquier otro rol (veterinarian, zootechnician, administrator) recibe 403.
 *   - Las rutas son estrictamente de solo GET; no se definen endpoints de escritura,
 *     por lo que POST/PUT/PATCH/DELETE retornan 404 por defecto de Hono.
 */
export function createOwnerPortalRouter(ownerPortalController) {
    const router = new OpenAPIHono();
    // ── Middleware global del router ─────────────────────────────────────────
    router.use('*', authMiddleware);
    router.use('*', rbacMiddleware('portal_propietario'));
    // ── Definición de rutas OpenAPI ──────────────────────────────────────────
    const getOwnerAnimalsRoute = createRoute({
        method: 'get',
        path: '/animals',
        summary: '[Portal Propietario] Listar mis animales',
        description: 'Retorna únicamente los animales que pertenecen al propietario autenticado. ' +
            'El propietario se resuelve a partir del `userId` del token JWT — no se acepta ningún parámetro externo.',
        security: [{ Bearer: [] }],
        tags: ['Portal Propietario'],
        responses: {
            200: {
                content: { 'application/json': { schema: ownerPortalAnimalsResponseSchema } },
                description: 'Lista de animales del propietario autenticado'
            },
            401: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Token JWT ausente o inválido'
            },
            403: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Acceso prohibido: el rol del usuario no es OWNER'
            },
            404: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'No existe perfil de propietario vinculado a esta cuenta'
            },
            500: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Error interno del servidor'
            }
        }
    });
    const getOwnerAnimalMedicalHistoryRoute = createRoute({
        method: 'get',
        path: '/animals/{animalId}/medical-history',
        summary: '[Portal Propietario] Ver historia clínica de mi animal',
        description: 'Retorna el historial clínico completo del animal indicado en modo solo lectura. ' +
            'Valida estrictamente que el animal pertenezca al propietario autenticado; ' +
            'si no le pertenece, responde 403 Forbidden.',
        security: [{ Bearer: [] }],
        tags: ['Portal Propietario'],
        request: {
            params: ownerPortalAnimalParamsSchema
        },
        responses: {
            200: {
                content: { 'application/json': { schema: ownerPortalMedicalHistoryResponseSchema } },
                description: 'Historia clínica completa del animal (solo lectura)'
            },
            401: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Token JWT ausente o inválido'
            },
            403: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Acceso prohibido: el animal no pertenece al propietario autenticado o el rol no es OWNER'
            },
            404: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Animal o perfil de propietario no encontrado'
            },
            500: {
                content: { 'application/json': { schema: errorSchema } },
                description: 'Error interno del servidor'
            }
        }
    });
    // ── Enlace de rutas con handlers ─────────────────────────────────────────
    // Nota: se usa el patrón (c) => controller.method(c) establecido en el proyecto.
    // @ts-expect-error — @hono/zod-openapi no puede inferir la unión de respuestas tipadas
    //                    que incluyen los códigos de error genéricos; el cast es intencional.
    router.openapi(getOwnerAnimalsRoute, (c) => ownerPortalController.getOwnerAnimals(c));
    // @ts-expect-error — misma razón que arriba
    router.openapi(getOwnerAnimalMedicalHistoryRoute, (c) => ownerPortalController.getOwnerAnimalMedicalHistory(c));
    return router;
}
