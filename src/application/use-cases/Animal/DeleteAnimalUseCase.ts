import type {AnimalRepository} from '@domain/repositories/AnimalRepository.js'
export class DeleteAnimalUseCase {
    constructor(private readonly animalRepository: AnimalRepository) {}

    async execute(id: string): Promise<void> {
        const animal = await this.animalRepository.findById(id);
        if (!animal) {
            throw new Error("Animal not found");
        }
        await this.animalRepository.delete(id);
    }
}
