import { z } from '@hono/zod-openapi';
export const adminIndicatorsResponseSchema = z.object({
    overview: z.object({
        totalUsers: z.number().openapi({ example: 12, description: 'Total de usuarios registrados' }),
        totalAnimals: z.number().openapi({ example: 45, description: 'Total de animales registrados' }),
        totalOwners: z.number().openapi({ example: 8, description: 'Total de propietarios registrados' }),
        activeAnimals: z.number().openapi({ example: 40, description: 'Total de animales activos' })
    }).openapi('AdminOverviewIndicators'),
    usersByRole: z.record(z.string(), z.number()).openapi({
        example: { administrator: 2, veterinarian: 5, zootechnician: 4, owner: 1 },
        description: 'Distribución de usuarios por rol'
    }),
    animalsBySpecies: z.record(z.string(), z.number()).openapi({
        example: { bovine: 25, equine: 10, canine: 5, feline: 5 },
        description: 'Distribución de animales por especie'
    }),
    recentActivities: z.array(z.object({
        id: z.string().openapi({ example: 'uuid-123' }),
        userId: z.string().nullable().openapi({ example: 'uuid-user-1' }),
        userEmail: z.string().nullable().openapi({ example: 'vet@agrovet.com' }),
        userRole: z.string().nullable().openapi({ example: 'veterinarian' }),
        action: z.string().openapi({ example: 'CREATE' }),
        resource: z.string().openapi({ example: 'ANIMAL' }),
        status: z.string().openapi({ example: 'SUCCESS' }),
        createdAt: z.string().openapi({ example: '2026-11-09T10:00:00.000Z' })
    })).openapi({ description: 'Últimas 10 actividades registradas en el sistema' })
}).openapi('AdminIndicatorsResponse');
