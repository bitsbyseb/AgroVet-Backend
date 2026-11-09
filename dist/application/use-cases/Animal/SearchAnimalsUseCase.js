export class SearchAnimalsUseCase {
    animalRepository;
    constructor(animalRepository) {
        this.animalRepository = animalRepository;
    }
    async execute(params) {
        const criteria = typeof params === 'string'
            ? { query: params }
            : (params || {});
        const animals = await this.animalRepository.search(criteria);
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
            ownerId: animal.ownerId,
            paddockId: animal.paddockId ?? null
        }));
    }
}
