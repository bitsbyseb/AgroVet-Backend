import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReproductionController } from '@infrastructure/http/hono/controllers/ReproductionController.js';
import type { RegisterReproductiveEventUseCase } from '@application/use-cases/Reproduction/RegisterReproductiveEventUseCase.js';
import type { GetReproductionHistoryUseCase } from '@application/use-cases/Reproduction/GetReproductionHistoryUseCase.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { randomUUID } from 'node:crypto';

describe('ReproductionController Unit Tests (Sprint 19 - HU12/HU13)', () => {
    let mockRegisterUseCase: { execute: ReturnType<typeof vi.fn> };
    let mockGetHistoryUseCase: { execute: ReturnType<typeof vi.fn> };
    let controller: ReproductionController;

    beforeEach(() => {
        mockRegisterUseCase = { execute: vi.fn() };
        mockGetHistoryUseCase = { execute: vi.fn() };

        controller = new ReproductionController(
            mockRegisterUseCase as unknown as RegisterReproductiveEventUseCase,
            mockGetHistoryUseCase as unknown as GetReproductionHistoryUseCase
        );
    });

    const createMockContext = (options: {
        params?: Record<string, string>;
        json?: any;
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
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        } as any;
    };

    describe('register', () => {
        it('debería registrar exitosamente un evento reproductivo y retornar 201', async () => {
            const animalId = randomUUID();
            const reproId = randomUUID();
            const fakeEvent = new Reproduction(
                reproId,
                animalId,
                ReproductiveStatus.PREGNANT,
                null,
                0,
                BreedingType.INSEMINATION,
                new Date('2026-05-10T08:00:00Z'),
                new Date('2027-02-17T08:00:00Z'),
                'TORO-098',
                'SEMEN-2026'
            );

            mockRegisterUseCase.execute.mockResolvedValue(fakeEvent);

            const c = createMockContext({
                params: { id: animalId },
                json: {
                    reproductiveStatus: 'pregnant',
                    breedingType: 'insemination',
                    heatDate: '2026-05-10T08:00:00Z',
                    bullId: 'TORO-098',
                    semenBatch: 'SEMEN-2026'
                }
            });

            const res = await controller.register(c);

            expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
                animalId,
                reproductiveStatus: 'pregnant',
                bullId: 'TORO-098'
            }));
            expect(c.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Reproduction record registered successfully',
                    id: reproId
                }),
                201
            );
        });

        it('debería retornar 404 si el animal no existe', async () => {
            mockRegisterUseCase.execute.mockRejectedValue(new Error('Animal with ID "xyz" not found'));

            const c = createMockContext({
                params: { id: 'xyz' },
                json: { reproductiveStatus: 'empty' }
            });

            await controller.register(c);

            expect(c.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('not found')
                }),
                404
            );
        });

        it('debería retornar 400 si las reglas de negocio fallan', async () => {
            mockRegisterUseCase.execute.mockRejectedValue(new Error('Offspring count cannot be negative'));

            const c = createMockContext({
                params: { id: randomUUID() },
                json: { reproductiveStatus: 'empty', offspringCount: -1 }
            });

            await controller.register(c);

            expect(c.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Offspring count cannot be negative'
                }),
                400
            );
        });
    });

    describe('getReproduction', () => {
        it('debería retornar 200 con el historial reproductivo del animal', async () => {
            const animalId = randomUUID();
            const fakeRecords = [
                new Reproduction(
                    randomUUID(),
                    animalId,
                    ReproductiveStatus.PREGNANT,
                    null,
                    0,
                    BreedingType.NATURAL,
                    new Date('2026-05-10T08:00:00Z')
                )
            ];

            mockGetHistoryUseCase.execute.mockResolvedValue(fakeRecords);

            const c = createMockContext({
                params: { id: animalId }
            });

            await controller.getReproduction(c);

            expect(mockGetHistoryUseCase.execute).toHaveBeenCalledWith(animalId);
            expect(c.json).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        animalId,
                        reproductiveStatus: ReproductiveStatus.PREGNANT
                    })
                ]),
                200
            );
        });

        it('debería retornar 404 si el animal no existe al consultar su historial', async () => {
            mockGetHistoryUseCase.execute.mockRejectedValue(new Error('Animal with ID "not-found" not found'));

            const c = createMockContext({
                params: { id: 'not-found' }
            });

            await controller.getReproduction(c);

            expect(c.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.stringContaining('not found')
                }),
                404
            );
        });
    });
});
