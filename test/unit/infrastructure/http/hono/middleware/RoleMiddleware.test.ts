import { describe, it, expect, vi } from 'vitest';
import { rbacMiddleware } from '@infrastructure/http/hono/middleware/RoleMiddleware.js';
import { UserRole } from '@domain/entities/User.js';
import type { Context } from 'hono';

function createMockContext(role?: string, method = 'GET') {
    const jsonMock = vi.fn().mockImplementation((data, status) => ({ data, status }));
    const context = {
        req: {
            method
        },
        get: vi.fn().mockImplementation((key: string) => {
            if (key === 'jwtPayload') {
                return role ? { sub: 'user-123', role } : null;
            }
            return null;
        }),
        json: jsonMock
    } as unknown as Context;

    return { context, jsonMock };
}

describe('Middleware de Seguridad RBAC (Sprint 16 y Sprint 17)', () => {
    it('debería retornar 401 si falta el payload JWT', async () => {
        const { context, jsonMock } = createMockContext(undefined, 'GET');
        const next = vi.fn();

        await rbacMiddleware('recordatorios_propietario')(context, next);

        expect(next).not.toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('Unauthorized') }),
            401
        );
    });

    it('debería retornar 500 si el recurso no está configurado en permissions', async () => {
        const { context, jsonMock } = createMockContext(UserRole.OWNER, 'GET');
        const next = vi.fn();

        await rbacMiddleware('recurso_inexistente' as any)(context, next);

        expect(next).not.toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringContaining('Resource not defined') }),
            500
        );
    });

    describe('Recurso: recordatorios_propietario (ASIDGA-180)', () => {
        it('debería permitir acceso GET al rol OWNER', async () => {
            const { context } = createMockContext(UserRole.OWNER, 'GET');
            const next = vi.fn();

            await rbacMiddleware('recordatorios_propietario')(context, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        it('debería permitir acceso GET al rol ADMIN', async () => {
            const { context } = createMockContext(UserRole.ADMIN, 'GET');
            const next = vi.fn();

            await rbacMiddleware('recordatorios_propietario')(context, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        it('debería permitir acceso GET al rol VETERINARIAN', async () => {
            const { context } = createMockContext(UserRole.VETERINARIAN, 'GET');
            const next = vi.fn();

            await rbacMiddleware('recordatorios_propietario')(context, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        it('debería bloquear con 403 al rol ZOOTECHNICIAN', async () => {
            const { context, jsonMock } = createMockContext(UserRole.ZOOTECHNICIAN, 'GET');
            const next = vi.fn();

            await rbacMiddleware('recordatorios_propietario')(context, next);

            expect(next).not.toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({ message: expect.stringContaining('Forbidden') }),
                403
            );
        });

        it('debería bloquear con 403 si un OWNER intenta realizar POST (Modo Solo Lectura estricto - ASIDGA-184)', async () => {
            const { context, jsonMock } = createMockContext(UserRole.OWNER, 'POST');
            const next = vi.fn();

            await rbacMiddleware('recordatorios_propietario')(context, next);

            expect(next).not.toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({ message: expect.stringContaining('Forbidden') }),
                403
            );
        });

        it('debería bloquear con 403 si un OWNER intenta realizar PUT o DELETE', async () => {
            const { context: putContext, jsonMock: putJson } = createMockContext(UserRole.OWNER, 'PUT');
            const nextPut = vi.fn();
            await rbacMiddleware('recordatorios_propietario')(putContext, nextPut);
            expect(nextPut).not.toHaveBeenCalled();
            expect(putJson).toHaveBeenCalledWith(expect.anything(), 403);

            const { context: delContext, jsonMock: delJson } = createMockContext(UserRole.OWNER, 'DELETE');
            const nextDel = vi.fn();
            await rbacMiddleware('recordatorios_propietario')(delContext, nextDel);
            expect(nextDel).not.toHaveBeenCalled();
            expect(delJson).toHaveBeenCalledWith(expect.anything(), 403);
        });
    });

    describe('Recurso: historial_medico (Sprint 17 - HU8/HU9 RBAC Matrix)', () => {
        it('debería otorgar Full Access (GET, POST, PUT, DELETE) al rol VETERINARIAN', async () => {
            for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
                const { context } = createMockContext(UserRole.VETERINARIAN, method);
                const next = vi.fn();
                await rbacMiddleware('historial_medico')(context, next);
                expect(next).toHaveBeenCalledTimes(1);
            }
        });

        it('debería otorgar acceso de Solo Lectura (GET) al rol ZOOTECHNICIAN y bloquear mutaciones', async () => {
            // GET permitido
            const { context: getContext } = createMockContext(UserRole.ZOOTECHNICIAN, 'GET');
            const nextGet = vi.fn();
            await rbacMiddleware('historial_medico')(getContext, nextGet);
            expect(nextGet).toHaveBeenCalledTimes(1);

            // POST / PUT / DELETE bloqueados con 403
            for (const method of ['POST', 'PUT', 'DELETE']) {
                const { context, jsonMock } = createMockContext(UserRole.ZOOTECHNICIAN, method);
                const next = vi.fn();
                await rbacMiddleware('historial_medico')(context, next);
                expect(next).not.toHaveBeenCalled();
                expect(jsonMock).toHaveBeenCalledWith(expect.anything(), 403);
            }
        });

        it('debería otorgar acceso de Solo Lectura (GET) al rol ADMINISTRATOR y bloquear mutaciones', async () => {
            // GET permitido
            const { context: getContext } = createMockContext(UserRole.ADMIN, 'GET');
            const nextGet = vi.fn();
            await rbacMiddleware('historial_medico')(getContext, nextGet);
            expect(nextGet).toHaveBeenCalledTimes(1);

            // POST / PUT / DELETE bloqueados con 403
            for (const method of ['POST', 'PUT', 'DELETE']) {
                const { context, jsonMock } = createMockContext(UserRole.ADMIN, method);
                const next = vi.fn();
                await rbacMiddleware('historial_medico')(context, next);
                expect(next).not.toHaveBeenCalled();
                expect(jsonMock).toHaveBeenCalledWith(expect.anything(), 403);
            }
        });
    });

    describe('Aislamiento de Recursos Clínicos y Globales frente al Rol OWNER', () => {
        it('debería bloquear al rol OWNER de acceder a /animals (recurso animales)', async () => {
            const { context, jsonMock } = createMockContext(UserRole.OWNER, 'GET');
            const next = vi.fn();

            await rbacMiddleware('animales')(context, next);

            expect(next).not.toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expect.anything(), 403);
        });

        it('debería bloquear al rol OWNER de registrar o modificar animales (POST /animals)', async () => {
            const { context, jsonMock } = createMockContext(UserRole.OWNER, 'POST');
            const next = vi.fn();

            await rbacMiddleware('animales')(context, next);

            expect(next).not.toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expect.anything(), 403);
        });

        it('debería bloquear al rol OWNER del recurso historial_medico administrativo', async () => {
            const { context, jsonMock } = createMockContext(UserRole.OWNER, 'GET');
            const next = vi.fn();

            await rbacMiddleware('historial_medico')(context, next);

            expect(next).not.toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expect.anything(), 403);
        });

        it('debería bloquear al rol OWNER de registrar historiales médicos (POST /history)', async () => {
            const { context, jsonMock } = createMockContext(UserRole.OWNER, 'POST');
            const next = vi.fn();

            await rbacMiddleware('historial_medico')(context, next);

            expect(next).not.toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expect.anything(), 403);
        });
    });
});
