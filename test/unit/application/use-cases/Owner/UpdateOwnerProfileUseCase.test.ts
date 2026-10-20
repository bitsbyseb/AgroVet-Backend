import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateOwnerProfileUseCase } from '@application/use-cases/Owner/UpdateOwnerProfileUseCase.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';

function buildOwner(): Owner {
    return new Owner(
        'owner-uuid-1',
        'Carlos Rodríguez',
        '11223344',
        '555-0010',
        'carlos@example.com',
        'Av. Principal 10',
        OwnerType.RURAL,
        null
    );
}

describe('Caso de Uso: Actualizar Propietario (UpdateOwnerProfileUseCase)', () => {
    let mockOwnerRepository: any;
    let useCase: UpdateOwnerProfileUseCase;

    beforeEach(() => {
        mockOwnerRepository = {
            findByDocument: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            findByUserId: vi.fn(),
            findAll: vi.fn(),
            save: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        useCase = new UpdateOwnerProfileUseCase(mockOwnerRepository as OwnerRepository);
    });

    it('debería actualizar los datos del propietario correctamente', async () => {
        const owner = buildOwner();
        mockOwnerRepository.findById.mockResolvedValue(owner);
        mockOwnerRepository.update.mockResolvedValue(undefined);

        await useCase.execute('owner-uuid-1', {
            name: 'Carlos A. Rodríguez',
            phone: '555-9999',
            email: 'carlos.a@example.com'
        });

        expect(mockOwnerRepository.findById).toHaveBeenCalledWith('owner-uuid-1');
        expect(mockOwnerRepository.update).toHaveBeenCalledTimes(1);

        const updatedOwner = mockOwnerRepository.update.mock.calls[0][0] as Owner;
        expect(updatedOwner.name).toBe('Carlos A. Rodríguez');
        expect(updatedOwner.phone).toBe('555-9999');
        expect(updatedOwner.email).toBe('carlos.a@example.com');
    });

    it('debería lanzar error si el propietario no existe', async () => {
        mockOwnerRepository.findById.mockResolvedValue(null);

        await expect(
            useCase.execute('id-inexistente', { name: 'Nuevo Nombre' })
        ).rejects.toThrow('Owner not found');

        expect(mockOwnerRepository.update).not.toHaveBeenCalled();
    });

    it('debería actualizar solo los campos proporcionados (actualización parcial)', async () => {
        const owner = buildOwner();
        mockOwnerRepository.findById.mockResolvedValue(owner);
        mockOwnerRepository.update.mockResolvedValue(undefined);

        await useCase.execute('owner-uuid-1', { address: 'Nueva Dirección 45' });

        const updatedOwner = mockOwnerRepository.update.mock.calls[0][0] as Owner;
        expect(updatedOwner.address).toBe('Nueva Dirección 45');
        // Campos no enviados permanecen intactos
        expect(updatedOwner.name).toBe('Carlos Rodríguez');
        expect(updatedOwner.email).toBe('carlos@example.com');
    });

    it('debería actualizar el tipo de propietario (ownerType)', async () => {
        const owner = buildOwner();
        mockOwnerRepository.findById.mockResolvedValue(owner);
        mockOwnerRepository.update.mockResolvedValue(undefined);

        await useCase.execute('owner-uuid-1', { ownerType: OwnerType.URBAN });

        const updatedOwner = mockOwnerRepository.update.mock.calls[0][0] as Owner;
        expect(updatedOwner.ownerType).toBe(OwnerType.URBAN);
    });
});
