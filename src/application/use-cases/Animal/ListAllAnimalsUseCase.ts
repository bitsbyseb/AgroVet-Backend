import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class ListAllAnimalsUseCase {
    constructor(private readonly animalRepository: AnimalRepository) {}

    async execute() {
        const animals = await this.animalRepository.findAll();
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
            ownerId: animal.ownerId
        }));
    }
}
