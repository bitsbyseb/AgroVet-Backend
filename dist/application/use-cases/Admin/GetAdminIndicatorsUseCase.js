export class GetAdminIndicatorsUseCase {
    userRepository;
    animalRepository;
    ownerRepository;
    auditLogRepository;
    constructor(userRepository, animalRepository, ownerRepository, auditLogRepository) {
        this.userRepository = userRepository;
        this.animalRepository = animalRepository;
        this.ownerRepository = ownerRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async execute() {
        const [users, animals, owners, recentLogs] = await Promise.all([
            this.userRepository.findAll(),
            this.animalRepository.findAll(),
            this.ownerRepository.findAll(),
            this.auditLogRepository.findAll({ limit: 10 })
        ]);
        // Breakdown users by role
        const usersByRole = {};
        for (const u of users) {
            const role = u.role ?? 'other';
            usersByRole[role] = (usersByRole[role] ?? 0) + 1;
        }
        // Breakdown animals by species and active count
        let activeAnimals = 0;
        const animalsBySpecies = {};
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
