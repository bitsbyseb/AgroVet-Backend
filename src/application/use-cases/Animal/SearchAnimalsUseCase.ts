import type { AnimalRepository, AnimalSearchParams } from "@domain/repositories/AnimalRepository.js";
import type { speciesType, Status } from "@domain/entities/Animal.js";

export interface SearchAnimalsDTO {
    query?: string;
    name?: string;
    identification?: string;
    species?: speciesType | string;
    ownerId?: string;
    status?: Status | string;
}

export class SearchAnimalsUseCase {
    constructor(private readonly animalRepository: AnimalRepository) {}

    async execute(params?: SearchAnimalsDTO | string) {
        const criteria: AnimalSearchParams = typeof params === 'string' 
            ? { query: params } 
            : (params || {});

        const animals = await this.animalRepository.search(criteria);

        return animals.map(animal => ({
            id: animal.id,
            name: animal.name,
            species: animal.species,
            animalType: animal.animalType,
            breed: animal.breed,
            gender: animal.gender,
            birthDate: animal.birthDate,
            status: animal.status,
            color: animal.color,
            ownerId: animal.ownerId,
            paddockId: animal.paddockId ?? null
        }));
    }
}
