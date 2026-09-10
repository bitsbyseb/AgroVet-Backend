export class DeleteAnimalUseCase {
    animalRepository;
    constructor(animalRepository) {
        this.animalRepository = animalRepository;
    }
    async execute(id) {
        const animal = await this.animalRepository.findById(id);
        if (!animal) {
            throw new Error("Animal not found");
        }
        await this.animalRepository.delete(id);
    }
}
