import { Animal } from "@domain/entities/Animal.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

export class RegisterAnimalUseCase {
    constructor(
        private readonly animalRepository: AnimalRepository,
        private readonly ownerRepository: OwnerRepository
    ) { }

    async execute(request: Animal): Promise<void> {
        const owner = await this.ownerRepository.findById(request.ownerId);
        if (!owner) {
            throw new Error("Owner not found");
        }

        const animal = new Animal(
            request.id,
            request.name,
            request.species,
            request.animalType,
            request.breed,
            request.gender,
            request.birthDate,
            request.status,
            request.color,
            request.ownerId
        );

        await this.animalRepository.save(animal);
    }
}
