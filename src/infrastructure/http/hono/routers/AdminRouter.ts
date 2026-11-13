import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import type { AdminController } from '../controllers/AdminController.js';
import type { AdminBackupController } from '../controllers/AdminBackupController.js';
import { adminIndicatorsResponseSchema } from '../validators/AdminValidator.js';
import { authMiddleware, rbacMiddleware } from '../middleware/RoleMiddleware.js';
import { errorResponseSchema } from '../validators/LoginValidator.js';

export function createAdminRouter(
    adminController: AdminController,
    adminBackupController: AdminBackupController
) {
    const router = new OpenAPIHono();

    // Autenticación JWT obligatoria para todas las rutas del módulo admin
    router.use('*', authMiddleware);

    // Solo el rol administrator tiene acceso (HU20 & Backup)
    router.use('*', rbacMiddleware('administracion'));

    // ─── GET /indicators ──────────────────────────────────────────────────────
    const getIndicatorsRoute = createRoute({
        method: 'get',
        path: '/indicators',
        summary: 'Consultar indicadores administrativos globales',
        description: 'Permite al administrador consultar las métricas generales del sistema (usuarios, animales, propietarios, especies y actividades recientes).',
        security: [{ Bearer: [] }],
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: adminIndicatorsResponseSchema
                    }
                },
                description: 'Indicadores administrativos obtenidos exitosamente'
            },
            401: { description: 'No autorizado - Token JWT ausente o inválido' },
            403: { description: 'Prohibido - Requiere rol administrator' },
            500: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Error interno del servidor'
            }
        },
        tags: ['Administración']
    });

    router.openapi(getIndicatorsRoute, (c) => adminController.getIndicators(c));

    // ─── GET /backup ───────────────────────────────────────────────────────────
    // Ruta de descarga de respaldo. Devuelve el archivo SQL como descarga binaria,
    // por lo que se declara con OpenAPI pero con content-type octet-stream.
    const downloadBackupRoute = createRoute({
        method: 'get',
        path: '/backup',
        summary: 'Descargar respaldo completo de la base de datos',
        description: 'Genera y descarga un volcado SQL completo de la base de datos MySQL. ' +
                     'El archivo incluye estructura y datos. Solo accesible por el rol administrator.',
        security: [{ Bearer: [] }],
        responses: {
            200: {
                content: {
                    'application/octet-stream': {
                        schema: z.string().openapi({
                            description: 'Archivo SQL de respaldo de la base de datos'
                        })
                    }
                },
                description: 'Archivo de respaldo descargado exitosamente'
            },
            401: { description: 'No autorizado - Token JWT ausente o inválido' },
            403: { description: 'Prohibido - Requiere rol administrator' },
            500: {
                content: { 'application/json': { schema: errorResponseSchema } },
                description: 'Error al generar el respaldo'
            }
        },
        tags: ['Administración - Backup']
    });

    router.openapi(downloadBackupRoute, (c) => adminBackupController.downloadBackup(c));

    // ─── POST /restore ─────────────────────────────────────────────────────────
    // Ruta de restauración. Recibe multipart/form-data con el campo "file".
    // No se puede representar fácilmente en zod-openapi con file upload; se usa
    // route.post() directamente. Los middlewares de authMiddleware y rbacMiddleware
    // ya fueron aplicados a nivel de router con use('*', ...) arriba.
    router.post('/restore', (c) => adminBackupController.restoreBackup(c));

    return router;
}
