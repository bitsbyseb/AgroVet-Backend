import { z } from "@hono/zod-openapi";

export const animalSchema = z.object({
    name: z.string().openapi({ example: 'Bessie', description: 'Nombre del animal' }),
    species: z.string().openapi({ example: 'Bovino', description: 'Especie del animal' }),
    breed: z.string().openapi({ example: 'Holstein', description: 'Raza del animal' }),
    birthDate: z.string().openapi({ example: '2022-01-15', description: 'Fecha de nacimiento (YYYY-MM-DD)' }),
    ownerId: z.string().openapi({ example: 'uuid-owner-123', description: 'ID del propietario' })
}).openapi('AnimalRequest');

export const updateAnimalSchema = animalSchema.partial().openapi('UpdateAnimalRequest');

export const transferAnimalSchema = z.object({
    newOwnerId: z.string().openapi({ example: 'uuid-new-owner-456', description: 'ID del nuevo propietario' })
}).openapi('TransferAnimalRequest');

export const animalResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-animal-789' }),
    name: z.string(),
    species: z.string(),
    breed: z.string(),
    birthDate: z.string(),
    ownerId: z.string()
}).openapi('AnimalResponse');

export const animalListResponseSchema = z.array(animalResponseSchema).openapi('AnimalListResponse');
