import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OwnerController } from '@infrastructure/http/hono/controllers/OwnerController.js';
import type { GetOwnerAnimalsUseCase } from '@application/use-cases/Owner/GetOwnerAnimalsUseCase.js';
import type { GetOwnerMedicalHistoryUseCase } from '@application/use-cases/Owner/GetOwnerMedicalHistoryUseCase.js';
import { animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import type { Context } from 'hono';

describe('OwnerController - Portal del Propietario (Sprint 11)', () => {
    let mockGetOwnerAnimalsPortalUseCase: { execute: ReturnType<typeof vi.fn> };
    let mockGetOwnerMedicalHistoryUseCase: { execute: ReturnType<typeof vi.fn> };
    let controller: OwnerController;

    beforeEach(() => {
        mockGetOwnerAnimalsPortalUseCase = {
            execute: vi.fn()
        };
        mockGetOwnerMedicalHistoryUseCase = {
            execute: vi.fn()
        };

        controller = new OwnerController(
            {} as any, // registerOwnerUseCase
            {} as any, // updateOwnerProfileUseCase
            {} as any, // getOwnerByIdUseCase
            {} as any, // listAllOwnersUseCase
            {} as any, // deleteOwnerUseCase
            {} as any, // getOwnerAnimalsUseCase (antiguo)
            mockGetOwnerAnimalsPortalUseCase as unknown as GetOwnerAnimalsUseCase,
            mockGetOwnerMedicalHistoryUseCase as unknown as GetOwnerMedicalHistoryUseCase
        );
    });

    describe('getOwnerAnimals', () => {
        it('debería retornar 200 y la lista de animales del propietario autenticado', async () => {
            const userId = 'user-uuid-1';
            const mockAnimals = [
                {
                    id: 'animal-1',
                    name: 'Bessie',
                    species: speciesType.BOVINE,
                    animalType: animalType.RURAL,
                    breed: 'Holstein',
                    gender: Gender.FEMALE,
                    birthDate: '2022-01-15T00:00:00.000Z',
                    status: Status.ACTIVE,
                    color: 'Blanco y Negro',
                    ownerId: 'owner-1',
                    paddockId: null
                }
            ];

            mockGetOwnerAnimalsPortalUseCase.execute.mockResolvedValue(mockAnimals);

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: userId, role: 'owner' }),
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimals(mockContext);

            expect(mockGetOwnerAnimalsPortalUseCase.execute).toHaveBeenCalledWith(userId);
            expect(mockContext.json).toHaveBeenCalledWith(mockAnimals, 200);
            expect(response).toEqual({ data: mockAnimals, status: 200 });
        });

        it('debería retornar 401 si no hay token JWT o el payload no contiene sub', async () => {
            const mockContext = {
                get: vi.fn().mockReturnValue(undefined),
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimals(mockContext);

            expect(mockGetOwnerAnimalsPortalUseCase.execute).not.toHaveBeenCalled();
            expect(mockContext.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.stringContaining('token') }),
                401
            );
            expect(response).toEqual({
                data: expect.objectContaining({ error: expect.any(String) }),
                status: 401
            });
        });

        it('debería retornar 404 si el usuario no tiene perfil de propietario asociado', async () => {
            mockGetOwnerAnimalsPortalUseCase.execute.mockRejectedValue(
                new Error('No se encontró un perfil de propietario asociado a este usuario.')
            );

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: 'user-sin-perfil', role: 'owner' }),
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimals(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.stringContaining('perfil de propietario') }),
                404
            );
            expect(response).toEqual({
                data: expect.objectContaining({ error: expect.any(String) }),
                status: 404
            });
        });

        it('debería retornar 500 ante errores inesperados', async () => {
            mockGetOwnerAnimalsPortalUseCase.execute.mockRejectedValue(
                new Error('Fallo de conexión en la base de datos')
            );

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: 'user-1', role: 'owner' }),
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimals(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(
                { error: 'Fallo de conexión en la base de datos' },
                500
            );
            expect(response).toEqual({
                data: { error: 'Fallo de conexión en la base de datos' },
                status: 500
            });
        });
    });

    describe('getOwnerAnimalMedicalHistory', () => {
        it('debería retornar 200 y el historial médico del animal', async () => {
            const userId = 'user-uuid-1';
            const animalId = 'animal-uuid-1';
            const mockHistory = [
                {
                    id: 'hist-1',
                    animalId,
                    date: '2024-03-15T00:00:00.000Z',
                    reason: 'Chequeo rutinario',
                    diagnosis: 'Animal sano',
                    treatment: 'Vitaminas',
                    observations: 'Evolución favorable',
                    createdBy: 'vet-uuid-1'
                }
            ];

            mockGetOwnerMedicalHistoryUseCase.execute.mockResolvedValue(mockHistory);

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: userId, role: 'owner' }),
                req: {
                    param: vi.fn().mockReturnValue({ animalId })
                },
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimalMedicalHistory(mockContext);

            expect(mockGetOwnerMedicalHistoryUseCase.execute).toHaveBeenCalledWith(userId, animalId);
            expect(mockContext.json).toHaveBeenCalledWith(mockHistory, 200);
            expect(response).toEqual({ data: mockHistory, status: 200 });
        });

        it('debería soportar parámetro id como identificador de animal', async () => {
            const userId = 'user-uuid-1';
            const animalId = 'animal-uuid-2';
            mockGetOwnerMedicalHistoryUseCase.execute.mockResolvedValue([]);

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: userId, role: 'owner' }),
                req: {
                    param: vi.fn().mockReturnValue({ id: animalId })
                },
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            await controller.getOwnerAnimalMedicalHistory(mockContext);

            expect(mockGetOwnerMedicalHistoryUseCase.execute).toHaveBeenCalledWith(userId, animalId);
            expect(mockContext.json).toHaveBeenCalledWith([], 200);
        });

        it('debería retornar 403 si el animal no pertenece al propietario autenticado', async () => {
            mockGetOwnerMedicalHistoryUseCase.execute.mockRejectedValue(
                new Error('Acceso no autorizado: el animal solicitado no pertenece a este propietario.')
            );

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: 'user-uuid-1', role: 'owner' }),
                req: {
                    param: vi.fn().mockReturnValue({ animalId: 'animal-ajeno' })
                },
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimalMedicalHistory(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.stringContaining('Acceso no autorizado') }),
                403
            );
            expect(response).toEqual({
                data: expect.objectContaining({ error: expect.any(String) }),
                status: 403
            });
        });

        it('debería retornar 404 si el animal no existe', async () => {
            mockGetOwnerMedicalHistoryUseCase.execute.mockRejectedValue(
                new Error('El animal con ID "animal-inexistente" no fue encontrado.')
            );

            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: 'user-uuid-1', role: 'owner' }),
                req: {
                    param: vi.fn().mockReturnValue({ animalId: 'animal-inexistente' })
                },
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimalMedicalHistory(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.stringContaining('no fue encontrado') }),
                404
            );
            expect(response).toEqual({
                data: expect.objectContaining({ error: expect.any(String) }),
                status: 404
            });
        });

        it('debería retornar 400 si el parámetro de animal no es proporcionado', async () => {
            const mockContext = {
                get: vi.fn().mockReturnValue({ sub: 'user-uuid-1', role: 'owner' }),
                req: {
                    param: vi.fn().mockReturnValue({})
                },
                json: vi.fn().mockImplementation((data, status) => ({ data, status }))
            } as unknown as Context;

            const response = await controller.getOwnerAnimalMedicalHistory(mockContext);

            expect(mockGetOwnerMedicalHistoryUseCase.execute).not.toHaveBeenCalled();
            expect(mockContext.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.stringContaining('Identificador del animal no proporcionado') }),
                400
            );
            expect(response).toEqual({
                data: expect.objectContaining({ error: expect.any(String) }),
                status: 400
            });
        });
    });
});
