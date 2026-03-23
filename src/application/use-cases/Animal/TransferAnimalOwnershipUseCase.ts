import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

interface TransferRequest {
    animalId: string;
    newOwnerId: string;
}

export class TransferAnimalOwnershipUseCase {
    constructor(
        private readonly animalRepository: AnimalRepository,
        private readonly ownerRepository: OwnerRepository
    ) {}

    async execute(request: TransferRequest): Promise<void> {
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
