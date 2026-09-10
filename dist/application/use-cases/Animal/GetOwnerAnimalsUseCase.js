export class GetOwnerAnimalsUseCase {
    animalRepository;
    ownerRepository;
    constructor(animalRepository, ownerRepository) {
        this.animalRepository = animalRepository;
        this.ownerRepository = ownerRepository;
    }
    async execute(ownerId) {
        const ownerExists = await this.ownerRepository.findById(ownerId);
        if (!ownerExists) {
            throw new Error("Owner not found");
        }
        const animals = await this.animalRepository.findByOwnerId(ownerId);
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
