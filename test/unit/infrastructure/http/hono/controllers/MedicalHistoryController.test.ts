import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MedicalHistoryController } from '@infrastructure/http/hono/controllers/MedicalHistoryController.js';
import type { CreateMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/CreateMedicalHistoryUseCase.js';
import type { GetMedicalHistoryByAnimalUseCase } from '@application/use-cases/MedicalHistory/GetMedicalHistoryByAnimalUseCase.js';
import type { UpdateMedicalHistoryUseCase } from '@application/use-cases/MedicalHistory/UpdateMedicalHistoryUseCase.js';
import { randomUUID } from 'node:crypto';

describe('MedicalHistoryController Unit Tests (Sprint 17 - HU8/HU9)', () => {
    let mockCreateUseCase: { execute: ReturnType<typeof vi.fn> };
    let mockGetByAnimalUseCase: { execute: ReturnType<typeof vi.fn> };
    let mockUpdateUseCase: { execute: ReturnType<typeof vi.fn> };
    let controller: MedicalHistoryController;

    beforeEach(() => {
        mockCreateUseCase = { execute: vi.fn() };
        mockGetByAnimalUseCase = { execute: vi.fn() };
        mockUpdateUseCase = { execute: vi.fn() };

        controller = new MedicalHistoryController(
            mockCreateUseCase as unknown as CreateMedicalHistoryUseCase,
            mockGetByAnimalUseCase as unknown as GetMedicalHistoryByAnimalUseCase,
            mockUpdateUseCase as unknown as UpdateMedicalHistoryUseCase
        );
    });

    const createMockContext = (options: {
        params?: Record<string, string>;
        json?: any;
        jwtPayload?: any;
    }) => {
        return {
            req: {
                param: (key?: string) => key ? options.params?.[key] : (options.params || {}),
                valid: (type: string) => {
                    if (type === 'param') return options.params || {};
                    if (type === 'json') return options.json || {};
                    return {};
                }
            },
            get: (key: string) => {
                if (key === 'jwtPayload') return options.jwtPayload;
                return undefined;
            },
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        } as any;
    };

    describe('listByAnimal', () => {
        it('debería retornar 200 con el historial médico del animal', async () => {
            const animalId = randomUUID();
            const mockHistories = [
                { id: '1', reason: 'R1', evolution: 'Buena evolución', weight: 20 }
            ];
            mockGetByAnimalUseCase.execute.mockResolvedValue(mockHistories);

            const c = createMockContext({ params: { animalId } });
            const response = await controller.listByAnimal(c);

            expect(mockGetByAnimalUseCase.execute).toHaveBeenCalledWith(animalId);
            expect(response.status).toBe(200);
            expect(response.data).toEqual(mockHistories);
        });

        it('debería retornar 404 si el animal no existe', async () => {
            mockGetByAnimalUseCase.execute.mockRejectedValue(new Error('Animal not found'));

            const c = createMockContext({ params: { animalId: 'invalid' } });
            const response = await controller.listByAnimal(c);

            expect(response.status).toBe(404);
        });
    });

    describe('create', () => {
        it('debería registrar un nuevo evento médico y retornar 201', async () => {
            const animalId = randomUUID();
            const userId = randomUUID();
            const inputData = {
                date: '2026-10-20T10:00:00Z',
                reason: 'Consulta general',
                diagnosis: 'Sano',
                treatment: 'Vitaminas',
                evolution: 'Normal',
                weight: 15.5
            };
            const mockCreated = { id: 'new-id', ...inputData, animalId, createdBy: userId };
            mockCreateUseCase.execute.mockResolvedValue(mockCreated);

            const c = createMockContext({
                params: { animalId },
                json: inputData,
                jwtPayload: { sub: userId }
            });

            const response = await controller.create(c);

            expect(mockCreateUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
                animalId,
                createdBy: userId,
                reason: 'Consulta general'
            }));
            expect(response.status).toBe(201);
            expect(response.data.message).toBe('Medical history entry added successfully');
        });

        it('debería retornar 404 si el animal no fue encontrado al crear', async () => {
            mockCreateUseCase.execute.mockRejectedValue(new Error('Animal not found'));

            const c = createMockContext({
                params: { animalId: 'non-existent' },
                json: { reason: 'R' }
            });

            const response = await controller.create(c);
            expect(response.status).toBe(404);
        });
    });

    describe('update', () => {
        it('debería actualizar la historia médica y retornar 200', async () => {
            const id = randomUUID();
            const updateData = {
                evolution: 'Paciente mejoró notablemente tras 24h',
                weight: 16.0
            };
            const mockUpdated = { id, ...updateData };
            mockUpdateUseCase.execute.mockResolvedValue(mockUpdated);

            const c = createMockContext({
                params: { id },
                json: updateData
            });

            const response = await controller.update(c);

            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith(id, updateData);
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Medical history entry updated successfully');
        });

        it('debería retornar 404 si la historia médica no existe', async () => {
            mockUpdateUseCase.execute.mockRejectedValue(new Error('Medical history not found'));

            const c = createMockContext({
                params: { id: 'invalid-id' },
                json: { evolution: 'Nueva' }
            });

            const response = await controller.update(c);
            expect(response.status).toBe(404);
        });
    });
});
