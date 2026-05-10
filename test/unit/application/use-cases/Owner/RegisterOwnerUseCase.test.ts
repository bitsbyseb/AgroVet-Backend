import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterOwnerUseCase } from '@application/use-cases/Owner/RegisterOwnerUseCase.js';
import { OwnerType } from '@domain/entities/Owner.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';

describe('Caso de Uso: Registrar Dueño (RegisterOwnerUseCase)', () => {
    let mockOwnerRepository: any;
    let useCase: RegisterOwnerUseCase;

    beforeEach(() => {
        mockOwnerRepository = {
            findByDocument: vi.fn(),
            save: vi.fn()
        };

        useCase = new RegisterOwnerUseCase(mockOwnerRepository as OwnerRepository);
    });

    it('debería registrar al dueño correctamente', async () => {
        mockOwnerRepository.findByDocument.mockResolvedValue(null);

        const request = {
            name: 'John Doe',
            document: '123456789',
            phone: '555-1234',
            email: 'john@example.com',
            address: '123 Main St',
            ownerType: OwnerType.URBAN
        };

        await useCase.execute(request);

        expect(mockOwnerRepository.findByDocument).toHaveBeenCalledWith('123456789');
        expect(mockOwnerRepository.save).toHaveBeenCalled();
        
        const savedOwner = mockOwnerRepository.save.mock.calls[0][0];
        expect(savedOwner.name).toBe('John Doe');
        expect(savedOwner.document).toBe('123456789');
        expect(savedOwner.id).toBeDefined();
    });

    it('debería fallar indicando que ya existe un dueño con ese documento', async () => {
        // Return a mock object to simulate existing owner
        mockOwnerRepository.findByDocument.mockResolvedValue({ id: 'existing-id' });

        const request = {
            name: 'Jane Doe',
            document: '123456789', // Same document
            phone: '555-5678',
            email: 'jane@example.com',
            address: '456 Side St',
            ownerType: OwnerType.RURAL
        };

        await expect(useCase.execute(request)).rejects.toThrow('Owner with this document already exists');
        expect(mockOwnerRepository.save).not.toHaveBeenCalled();
    });
});
