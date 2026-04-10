import { Animal, Status } from "@domain/entities/Animal.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";
import type { animalCreationType } from "@infrastructure/http/hono/validators/AnimalValidator.js";

export class RegisterAnimalUseCase {
    constructor(
        private readonly animalRepository: AnimalRepository,
        private readonly ownerRepository: OwnerRepository
    ) { }

    async execute(request: animalCreationType): Promise<void> {
        const owner = await this.ownerRepository.findById(request.ownerId);
        if (!owner) {
            throw new Error("Owner not found");
        }

        const animal = new Animal(
            crypto.randomUUID(), // El ID se genera en el backend
            request.name,
            request.species,
            request.animalType,
            request.breed,
            request.gender,
            new Date(request.birthDate), // Convertimos el string a Date
            undefined, // status por defecto
            request.color,
            request.ownerId
        );

        await this.animalRepository.save(animal);
    }
}
