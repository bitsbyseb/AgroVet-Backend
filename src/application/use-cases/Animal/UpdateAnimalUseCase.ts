import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class UpdateAnimalUseCase {
    constructor(private readonly animalRepository: AnimalRepository) {}

    async execute(id: string, request: any): Promise<void> {
        const animal = await this.animalRepository.findById(id);
        if (!animal) {
            throw new Error("Animal not found");
        }

        animal.updatePhysicalData(request);
        await this.animalRepository.update(animal);
    }
}
