import { z } from "@hono/zod-openapi";
import { animalType, speciesType, Gender } from "@domain/entities/Animal.js";

// El Status normalmente se inicializa internamente, por lo que no es estricto en la creación
// pero lo podemos exponer en la actualización.
const StatusEnum = z.enum(["active", "inactive"]);

export const animalSchema = z.object({
    name: z.string().openapi({ example: 'Bessie', description: 'Nombre del animal' }),
    species: z.nativeEnum(speciesType).openapi({ example: speciesType.BOVINE, description: 'Especie del animal' }),
    animalType: z.nativeEnum(animalType).openapi({ example: animalType.RURAL, description: 'Tipo de animal (urbano o rural)' }),
    breed: z.string().openapi({ example: 'Holstein', description: 'Raza del animal' }),
    gender: z.nativeEnum(Gender).openapi({ example: Gender.FEMALE, description: 'Género del animal' }),
    birthDate: z.string().openapi({ example: '2022-01-15T00:00:00.000Z', description: 'Fecha de nacimiento (ISO 8601)' }),
    color: z.string().openapi({ example: 'Blanco y Negro', description: 'Color del animal' }),
    ownerId: z.string().openapi({ example: 'uuid-owner-123', description: 'ID del propietario' })
}).openapi('AnimalRequest');

// Schema para actualización (no puede actualizar el ownerId por aquí, se hace con transfer)
export const updateAnimalSchema = z.object({
    name: z.string().optional().openapi({ example: 'Bessie' }),
    color: z.string().optional().openapi({ example: 'Negro' }),
    breed: z.string().optional().openapi({ example: 'Angus' }),
    status: StatusEnum.optional().openapi({ example: 'inactive' })
}).openapi('UpdateAnimalRequest');

export const transferAnimalSchema = z.object({
    newOwnerId: z.string().openapi({ example: 'uuid-new-owner-456', description: 'ID del nuevo propietario' })
}).openapi('TransferAnimalRequest');

// Schema de respuesta
export const animalResponseSchema = z.object({
    id: z.string().openapi({ example: 'uuid-animal-789' }),
    name: z.string(),
    species: z.nativeEnum(speciesType),
    animalType: z.nativeEnum(animalType),
    breed: z.string(),
    gender: z.nativeEnum(Gender),
    birthDate: z.string(),
    status: z.string(),
    color: z.string(),
    ownerId: z.string()
}).openapi('AnimalResponse');

export const animalListResponseSchema = z.array(animalResponseSchema).openapi('AnimalListResponse');

// Tipos extraidos
export type animalCreationType = z.infer<typeof animalSchema>;
export type animalUpdateType = z.infer<typeof updateAnimalSchema>;
