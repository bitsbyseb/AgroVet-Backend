import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAdminIndicatorsUseCase } from '@application/use-cases/Admin/GetAdminIndicatorsUseCase.js';
import { UserRole } from '@domain/entities/User.js';
import type { UserRepository } from '@domain/repositories/UserRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { AuditLogRepository } from '@domain/repositories/AuditLogRepository.js';
import { AuditLog } from '@domain/entities/AuditLog.js';

describe('GetAdminIndicatorsUseCase (HU20)', () => {
    let mockUserRepo: { findAll: ReturnType<typeof vi.fn> };
    let mockAnimalRepo: { findAll: ReturnType<typeof vi.fn> };
    let mockOwnerRepo: { findAll: ReturnType<typeof vi.fn> };
    let mockAuditRepo: { findAll: ReturnType<typeof vi.fn> };
    let useCase: GetAdminIndicatorsUseCase;

    const mockUsers = [
        { id: 'u1', role: UserRole.ADMIN, email: 'admin@agrovet.com' },
        { id: 'u2', role: UserRole.VETERINARIAN, email: 'vet@agrovet.com' },
        { id: 'u3', role: UserRole.ZOOTECHNICIAN, email: 'zoo@agrovet.com' },
        { id: 'u4', role: UserRole.VETERINARIAN, email: 'vet2@agrovet.com' }
    ];

    const mockAnimals = [
        { id: 'a1', species: 'bovine', status: 'active' },
        { id: 'a2', species: 'bovine', status: 'active' },
        { id: 'a3', species: 'equine', status: 'active' },
        { id: 'a4', species: 'canine', status: 'inactive' }
    ];

    const mockOwners = [
        { id: 'o1', name: 'Carlos Gomez' },
        { id: 'o2', name: 'Maria Rodriguez' }
    ];

    const mockLogs: AuditLog[] = [
        new AuditLog({
            id: 'l1',
            userId: 'u1',
            userEmail: 'admin@agrovet.com',
            userRole: 'administrator',
            action: 'LOGIN',
            resource: 'AUTH',
            status: 'SUCCESS',
            createdAt: new Date('2026-11-09T10:00:00Z')
        })
    ];

    beforeEach(() => {
        mockUserRepo = { findAll: vi.fn().mockResolvedValue(mockUsers) };
        mockAnimalRepo = { findAll: vi.fn().mockResolvedValue(mockAnimals) };
        mockOwnerRepo = { findAll: vi.fn().mockResolvedValue(mockOwners) };
        mockAuditRepo = { findAll: vi.fn().mockResolvedValue(mockLogs) };

        useCase = new GetAdminIndicatorsUseCase(
            mockUserRepo as unknown as UserRepository,
            mockAnimalRepo as unknown as AnimalRepository,
            mockOwnerRepo as unknown as OwnerRepository,
            mockAuditRepo as unknown as AuditLogRepository
        );
    });

    it('should aggregate global metrics correctly', async () => {
        const indicators = await useCase.execute();

        expect(indicators.overview).toEqual({
            totalUsers: 4,
            totalAnimals: 4,
            totalOwners: 2,
            activeAnimals: 3
        });

        expect(indicators.usersByRole).toEqual({
            [UserRole.ADMIN]: 1,
            [UserRole.VETERINARIAN]: 2,
            [UserRole.ZOOTECHNICIAN]: 1
        });

        expect(indicators.animalsBySpecies).toEqual({
            bovine: 2,
            equine: 1,
            canine: 1
        });

        expect(indicators.recentActivities).toHaveLength(1);
        expect(indicators.recentActivities[0].action).toBe('LOGIN');
        expect(indicators.recentActivities[0].userEmail).toBe('admin@agrovet.com');
    });

    it('should handle empty repositories gracefully', async () => {
        mockUserRepo.findAll.mockResolvedValue([]);
        mockAnimalRepo.findAll.mockResolvedValue([]);
        mockOwnerRepo.findAll.mockResolvedValue([]);
        mockAuditRepo.findAll.mockResolvedValue([]);

        const indicators = await useCase.execute();

        expect(indicators.overview).toEqual({
            totalUsers: 0,
            totalAnimals: 0,
            totalOwners: 0,
            activeAnimals: 0
        });
        expect(indicators.usersByRole).toEqual({});
        expect(indicators.animalsBySpecies).toEqual({});
        expect(indicators.recentActivities).toEqual([]);
    });
});
