import type {AnimalRepository} from '@domain/repositories/AnimalRepository.js'

export class GetAnimalByIdUseCase {
    constructor(private readonly animalRepository: AnimalRepository) {}

    async execute(id: string) {
        const animal = await this.animalRepository.findById(id);
        if (!animal) {
            throw new Error("Animal not found");
        }

        return {
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
        };
    }
}
