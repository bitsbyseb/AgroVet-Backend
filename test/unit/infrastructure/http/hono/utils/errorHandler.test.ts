import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleControllerError } from '@infrastructure/http/hono/utils/errorHandler.js';
import {
    DatabaseError,
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError
} from '@sequelize/core';

describe('handleControllerError Unit Tests', () => {
    let mockContext: any;
    let consoleSpy: any;

    beforeEach(() => {
        mockContext = {
            req: {
                method: 'GET',
                path: '/api/v1/test'
            },
            json: vi.fn().mockImplementation((data, status) => ({ data, status }))
        };
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should log full error to console', () => {
        const error = new Error('Test log');
        handleControllerError(mockContext, error);

        expect(consoleSpy).toHaveBeenCalledWith(
            '[Error en GET /api/v1/test]:',
            error
        );
    });

    it('should sanitize DatabaseError and return 500 without leaking raw SQL', () => {
        const dbError = new DatabaseError(new Error('SELECT * FROM secret_table WHERE syntax_error'));
        const response = handleControllerError(mockContext, dbError);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'Error al procesar la operación en la base de datos' },
            500
        );
        expect(response.data.error).not.toContain('SELECT');
        expect(response.data.error).not.toContain('secret_table');
    });

    it('should handle Sequelize ValidationError and return 400 with details', () => {
        const valError = new ValidationError('Validation error');
        valError.errors = [
            { message: 'name cannot be null' } as any,
            { message: 'age must be positive' } as any
        ];

        handleControllerError(mockContext, valError);

        expect(mockContext.json).toHaveBeenCalledWith(
            {
                error: 'Error de validación en la base de datos',
                details: ['name cannot be null', 'age must be positive']
            },
            400
        );
    });

    it('should handle UniqueConstraintError and return 400 with sanitized message', () => {
        const uniqueError = new UniqueConstraintError({
            message: 'Duplicate entry firulais for key name'
        });

        handleControllerError(mockContext, uniqueError);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'El registro ya existe o viola una restricción única en la base de datos' },
            400
        );
    });

    it('should handle ForeignKeyConstraintError and return 400 with sanitized message', () => {
        const fkError = new ForeignKeyConstraintError({
            message: 'foreign key constraint fails'
        });

        handleControllerError(mockContext, fkError);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'Referencia no válida: el registro relacionado no existe en la base de datos' },
            400
        );
    });

    it('should return 404 for not found errors', () => {
        const error = new Error('Animal not found');
        handleControllerError(mockContext, error);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'Animal not found' },
            404
        );
    });

    it('should return 403 for unauthorized errors', () => {
        const error = new Error('Acceso no autorizado a este recurso');
        handleControllerError(mockContext, error);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'Acceso no autorizado a este recurso' },
            403
        );
    });

    it('should return 400 for input validation errors', () => {
        const error = new Error('startDate cannot be after endDate');
        handleControllerError(mockContext, error);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'startDate cannot be after endDate' },
            400
        );
    });

    it('should fallback to default error message on unknown error object', () => {
        handleControllerError(mockContext, null, 'Error por defecto', 500);

        expect(mockContext.json).toHaveBeenCalledWith(
            { error: 'Error por defecto' },
            500
        );
    });
});
