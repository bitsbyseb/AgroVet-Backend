export class TransferAnimalOwnershipUseCase {
    animalRepository;
    ownerRepository;
    constructor(animalRepository, ownerRepository) {
        this.animalRepository = animalRepository;
        this.ownerRepository = ownerRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }
        const newOwner = await this.ownerRepository.findById(request.newOwnerId);
        if (!newOwner) {
            throw new Error("New owner does not exist");
        }
        animal.transferTo(request.newOwnerId);
        await this.animalRepository.update(animal);
    }
}
