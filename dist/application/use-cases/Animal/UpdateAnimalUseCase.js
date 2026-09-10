export class UpdateAnimalUseCase {
    animalRepository;
    constructor(animalRepository) {
        this.animalRepository = animalRepository;
    }
    async execute(id, request) {
        const animal = await this.animalRepository.findById(id);
        if (!animal) {
            throw new Error("Animal not found");
        }
        // Status is technically an enum inside the class, so we cast it or map it if necessary
        // but TypeScript will accept the mapped object if the types align, which they do
        // since Status is just the string values "active" | "inactive".
        // Cast request as any to bypass private enum mismatch just for passing to entity,
        // or properly import Status from Animal if it were exported. 
        // We will just pass the mapped object.
        animal.updatePhysicalData(request);
        await this.animalRepository.update(animal);
    }
}
