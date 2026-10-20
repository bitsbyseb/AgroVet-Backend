import type { Context } from 'hono';
import {
    BaseError,
    DatabaseError,
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError
} from '@sequelize/core';

export interface SanitizedErrorResponse {
    error: string;
    details?: string[];
}

/**
 * Captura y sanitiza errores en los controladores HTTP de Hono.
 * - Registra el error detallado (con stack trace e info interna) en la consola para depuración backend.
 * - Devuelve al cliente frontend un JSON estructurado con status HTTP 400, 404, 409 o 500,
 *   evitando la exposición de consultas SQL o trazas de la base de datos.
 */
export function handleControllerError(
    c: Context,
    error: unknown,
    fallbackMessage = 'Error interno del servidor',
    fallbackStatus: 400 | 404 | 500 = 500
): any {
    // Log detallado en consola para trazabilidad y auditoría
    const method = c.req?.method ?? 'UNKNOWN';
    const path = c.req?.path ?? 'UNKNOWN';
    console.error(`[Error en ${method} ${path}]:`, error);

    // 1. Restricción única violada (UniqueConstraintError hereda de ValidationError) -> 400
    if (
        error instanceof UniqueConstraintError ||
        (error as any)?.name === 'SequelizeUniqueConstraintError' ||
        (error as any)?.name === 'UniqueConstraintError'
    ) {
        return c.json<SanitizedErrorResponse>({
            error: 'El registro ya existe o viola una restricción única en la base de datos'
        }, 400);
    }

    // 2. Clave foránea no encontrada -> 400
    if (
        error instanceof ForeignKeyConstraintError ||
        (error as any)?.name === 'SequelizeForeignKeyConstraintError' ||
        (error as any)?.name === 'ForeignKeyConstraintError'
    ) {
        return c.json<SanitizedErrorResponse>({
            error: 'Referencia no válida: el registro relacionado no existe en la base de datos'
        }, 400);
    }

    // 3. Error de validación de Sequelize (campo faltante, formato inválido, etc.) -> 400
    if (
        error instanceof ValidationError ||
        (error as any)?.name === 'SequelizeValidationError' ||
        (error as any)?.name === 'ValidationError'
    ) {
        const valError = error as ValidationError;
        const details = valError.errors?.map((e) => e.message) || [];
        return c.json<SanitizedErrorResponse>({
            error: 'Error de validación en la base de datos',
            ...(details.length > 0 ? { details } : {})
        }, 400);
    }

    // 4. Error general de base de datos de Sequelize -> 500 Sanitizado
    if (
        error instanceof DatabaseError ||
        error instanceof BaseError ||
        (error as any)?.name?.includes('Sequelize') ||
        (error as any)?.name?.includes('DatabaseError')
    ) {
        return c.json<SanitizedErrorResponse>({
            error: 'Error al procesar la operación en la base de datos'
        }, 500);
    }

    // 5. Errores de lógica de negocio (instancias de Error estándar)
    if (error instanceof Error) {
        const msg = error.message;

        // No encontrado (404)
        if (
            msg.toLowerCase().includes('not found') ||
            msg.toLowerCase().includes('no encontrado') ||
            msg.toLowerCase().includes('no fue encontrado') ||
            msg.toLowerCase().includes('perfil de propietario')
        ) {
            return c.json<SanitizedErrorResponse>({ error: msg }, 404);
        }

        // Prohibido / No autorizado (403)
        if (
            msg.toLowerCase().includes('no autorizado') ||
            msg.toLowerCase().includes('unauthorized') ||
            msg.toLowerCase().includes('acceso no autorizado')
        ) {
            return c.json<SanitizedErrorResponse>({ error: msg }, 403);
        }

        // Validaciones de negocio / parámetros erróneos (400)
        if (
            fallbackStatus === 400 ||
            msg.includes('Invalid') ||
            msg.includes('cannot be after') ||
            msg.includes('inválid') ||
            msg.includes('Identificador')
        ) {
            return c.json<SanitizedErrorResponse>({ error: msg }, 400);
        }

        return c.json<SanitizedErrorResponse>({ error: msg || fallbackMessage }, fallbackStatus);
    }

    // 6. Error desconocido o no instanciado
    return c.json<SanitizedErrorResponse>({ error: fallbackMessage }, fallbackStatus);
}
