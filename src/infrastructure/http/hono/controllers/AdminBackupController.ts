import type { Context } from 'hono';
import { generateBackup, restoreBackup } from '@infrastructure/services/AdminBackupService.js';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * Controlador para las operaciones de respaldo y restauración de la base de datos.
 * Todas las rutas de este controlador están protegidas por RBAC (rol administrator).
 */
export class AdminBackupController {

    /**
     * GET /admin/backup
     * Genera un volcado SQL completo de la base de datos y lo devuelve como
     * archivo descargable (.sql) al cliente administrador.
     */
    async downloadBackup(c: Context) {
        try {
            const sqlBuffer = await generateBackup();

            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, '-')
                .slice(0, 19);
            const filename = `agrovet-backup-${timestamp}.sql`;

            // Cabeceras para descarga de archivo
            c.header('Content-Type', 'application/octet-stream');
            c.header('Content-Disposition', `attachment; filename="${filename}"`);
            c.header('Content-Length', String(sqlBuffer.length));
            c.header('Cache-Control', 'no-store, no-cache, must-revalidate');

            // Convertir Buffer a ReadableStream para compatibilidad con Hono
            const readable = new ReadableStream({
                start(controller) {
                    controller.enqueue(sqlBuffer);
                    controller.close();
                }
            });

            return c.body(readable);
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al generar el respaldo de la base de datos', 500);
        }
    }

    /**
     * POST /admin/restore
     * Recibe un archivo .sql mediante multipart/form-data y ejecuta la
     * restauración de la base de datos. Incluye validaciones de seguridad
     * sobre el archivo recibido antes de proceder.
     */
    async restoreBackup(c: Context) {
        try {
            // Parsear el cuerpo multipart/form-data
            const body = await c.req.parseBody();
            const file = body['file'];

            if (!file || typeof file === 'string') {
                return c.json(
                    { error: 'No se recibió ningún archivo. Adjunte un archivo .sql en el campo "file".' },
                    400
                );
            }

            const uploadedFile = file as File;

            // Validar nombre y tipo del archivo
            if (!uploadedFile.name.toLowerCase().endsWith('.sql')) {
                return c.json(
                    { error: 'El archivo debe tener extensión .sql.' },
                    400
                );
            }

            // Límite de tamaño: 100 MB para prevenir abusos
            const MAX_SIZE_BYTES = 100 * 1024 * 1024;
            if (uploadedFile.size > MAX_SIZE_BYTES) {
                return c.json(
                    { error: 'El archivo supera el límite de tamaño permitido (100 MB).' },
                    400
                );
            }

            if (uploadedFile.size === 0) {
                return c.json({ error: 'El archivo .sql está vacío.' }, 400);
            }

            // Leer el contenido del archivo
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const sqlBuffer = Buffer.from(arrayBuffer);

            // Validación básica de contenido: debe parecer un dump SQL válido
            const header = sqlBuffer.slice(0, 100).toString('utf8');
            if (
                !header.includes('--') &&
                !header.toLowerCase().includes('create') &&
                !header.toLowerCase().includes('insert') &&
                !header.toLowerCase().includes('mysql')
            ) {
                return c.json(
                    { error: 'El contenido del archivo no parece ser un volcado SQL válido.' },
                    400
                );
            }

            // Ejecutar la restauración
            await restoreBackup(sqlBuffer);

            return c.json(
                {
                    message: 'Base de datos restaurada exitosamente.',
                    filename: uploadedFile.name,
                    sizeBytes: uploadedFile.size
                },
                200
            );
        } catch (error: unknown) {
            return handleControllerError(c, error, 'Error al restaurar la base de datos', 500);
        }
    }
}
