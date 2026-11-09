import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimalController } from '@infrastructure/http/hono/controllers/AnimalController.js';

describe('AnimalController Unit Tests (Sprint 20 - HU14 Buscar & HU15 Filtrar Animales)', () => {
    let mockRegisterAnimalUseCase: any;
    let mockGetAnimalByIdUseCase: any;
    let mockListAllAnimalsUseCase: any;
    let mockUpdateAnimalUseCase: any;
    let mockDeleteAnimalUseCase: any;
    let mockTransferAnimalOwnershipUseCase: any;
    let mockSearchAnimalsUseCase: any;
    let controller: AnimalController;

    const mockAnimals = [
        { id: 'uuid-1', name: 'Bessie', species: 'bovine' },
        { id: 'uuid-2', name: 'Bella', species: 'bovine' }
    ];

    beforeEach(() => {
        mockRegisterAnimalUseCase = { execute: vi.fn() };
        mockGetAnimalByIdUseCase = { execute: vi.fn() };
        mockListAllAnimalsUseCase = { execute: vi.fn().mockResolvedValue(mockAnimals) };
        mockUpdateAnimalUseCase = { execute: vi.fn() };
        mockDeleteAnimalUseCase = { execute: vi.fn() };
        mockTransferAnimalOwnershipUseCase = { execute: vi.fn() };
        mockSearchAnimalsUseCase = { execute: vi.fn().mockResolvedValue([mockAnimals[0]]) };

        controller = new AnimalController(
            mockRegisterAnimalUseCase,
            mockGetAnimalByIdUseCase,
            mockListAllAnimalsUseCase,
            mockUpdateAnimalUseCase,
            mockDeleteAnimalUseCase,
            mockTransferAnimalOwnershipUseCase,
            mockSearchAnimalsUseCase
        );
    });

    it('debería ejecutar search() con query params y retornar 200 con resultados', async () => {
        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({ query: 'Bessie' }),
                query: vi.fn().mockReturnValue({ query: 'Bessie' })
            },
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        };

        const response = await controller.search(mockContext);

        expect(mockSearchAnimalsUseCase.execute).toHaveBeenCalledWith({
            query: 'Bessie',
            name: undefined,
            identification: undefined,
            species: undefined,
            ownerId: undefined,
            status: undefined
        });
        expect(mockContext.json).toHaveBeenCalledWith([mockAnimals[0]]);
        expect(response.status).toBe(200);
    });

    it('debería ejecutar search() con filtros avanzados (species, ownerId, status) (HU15)', async () => {
        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({
                    species: 'bovine',
                    ownerId: 'owner-uuid-1',
                    status: 'active'
                }),
                query: vi.fn().mockReturnValue({
                    species: 'bovine',
                    ownerId: 'owner-uuid-1',
                    status: 'active'
                })
            },
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        };

        const response = await controller.search(mockContext);

        expect(mockSearchAnimalsUseCase.execute).toHaveBeenCalledWith({
            query: undefined,
            name: undefined,
            identification: undefined,
            species: 'bovine',
            ownerId: 'owner-uuid-1',
            status: 'active'
        });
        expect(response.status).toBe(200);
    });

    it('debería ejecutar search() con parámetro q alternativo', async () => {
        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({ q: 'uuid-1' }),
                query: vi.fn().mockReturnValue({ q: 'uuid-1' })
            },
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        };

        await controller.search(mockContext);

        expect(mockSearchAnimalsUseCase.execute).toHaveBeenCalledWith({
            query: 'uuid-1',
            name: undefined,
            identification: undefined,
            species: undefined,
            ownerId: undefined,
            status: undefined
        });
    });

    it('debería delegar a search en list() si se envían query params o filtros', async () => {
        const mockContext: any = {
            req: {
                query: vi.fn().mockReturnValue({ species: 'bovine' })
            },
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        };

        await controller.list(mockContext);

        expect(mockSearchAnimalsUseCase.execute).toHaveBeenCalledWith({
            query: undefined,
            name: undefined,
            identification: undefined,
            species: 'bovine',
            ownerId: undefined,
            status: undefined
        });
        expect(mockListAllAnimalsUseCase.execute).not.toHaveBeenCalled();
    });

    it('debería ejecutar listAllAnimalsUseCase en list() si no hay query params', async () => {
        const mockContext: any = {
            req: {
                query: vi.fn().mockReturnValue({})
            },
            json: vi.fn().mockImplementation((data, status = 200) => ({ data, status }))
        };

        await controller.list(mockContext);

        expect(mockListAllAnimalsUseCase.execute).toHaveBeenCalled();
        expect(mockSearchAnimalsUseCase.execute).not.toHaveBeenCalled();
    });

    it('debería capturar errores y retornar 500 si falla la búsqueda', async () => {
        mockSearchAnimalsUseCase.execute.mockRejectedValue(new Error('DB failure'));

        const mockContext: any = {
            req: {
                valid: vi.fn().mockReturnValue({ query: 'Error' }),
                query: vi.fn().mockReturnValue({ query: 'Error' })
            },
            json: vi.fn().mockImplementation((data, status) => ({ data, status }))
        };

        const response = await controller.search(mockContext);

        expect(response.status).toBe(500);
        expect(response.data).toHaveProperty('error');
    });
});
