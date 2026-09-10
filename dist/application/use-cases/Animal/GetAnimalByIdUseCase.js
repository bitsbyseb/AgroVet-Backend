export class GetAnimalByIdUseCase {
    animalRepository;
    constructor(animalRepository) {
        this.animalRepository = animalRepository;
    }
    async execute(id) {
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
