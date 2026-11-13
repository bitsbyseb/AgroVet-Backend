import type { UserRepository } from '@domain/repositories/UserRepository.js';
import type { AnimalRepository } from '@domain/repositories/AnimalRepository.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { AuditLogRepository } from '@domain/repositories/AuditLogRepository.js';

export interface AdminIndicators {
    overview: {
        totalUsers: number;
        totalAnimals: number;
        totalOwners: number;
        activeAnimals: number;
    };
    usersByRole: Record<string, number>;
    animalsBySpecies: Record<string, number>;
    recentActivities: {
        id: string;
        userId: string | null;
        userEmail: string | null;
        userRole: string | null;
        action: string;
        resource: string;
        status: string;
        createdAt: string;
    }[];
}

export class GetAdminIndicatorsUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly animalRepository: AnimalRepository,
        private readonly ownerRepository: OwnerRepository,
        private readonly auditLogRepository: AuditLogRepository
    ) {}

    async execute(): Promise<AdminIndicators> {
        const [users, animals, owners, recentLogs] = await Promise.all([
            this.userRepository.findAll(),
            this.animalRepository.findAll(),
            this.ownerRepository.findAll(),
            this.auditLogRepository.findAll({ limit: 10 })
        ]);

        // Breakdown users by role
        const usersByRole: Record<string, number> = {};
        for (const u of users) {
            const role = u.role ?? 'other';
            usersByRole[role] = (usersByRole[role] ?? 0) + 1;
        }

        // Breakdown animals by species and active count
        let activeAnimals = 0;
        const animalsBySpecies: Record<string, number> = {};
        for (const a of animals) {
            const species = a.species ?? 'other';
            animalsBySpecies[species] = (animalsBySpecies[species] ?? 0) + 1;
            if (a.status === 'active') {
                activeAnimals++;
            }
        }

        const recentActivities = recentLogs.map((log) => ({
            id: log.id,
            userId: log.userId,
            userEmail: log.userEmail,
            userRole: log.userRole,
            action: log.action,
            resource: log.resource,
            status: log.status,
            createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : new Date(log.createdAt).toISOString()
        }));

        return {
            overview: {
                totalUsers: users.length,
                totalAnimals: animals.length,
                totalOwners: owners.length,
                activeAnimals
            },
            usersByRole,
            animalsBySpecies,
            recentActivities
        };
    }
}
