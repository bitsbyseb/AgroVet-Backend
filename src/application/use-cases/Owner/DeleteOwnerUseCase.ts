import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

export class DeleteOwnerUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(id: string): Promise<void> {
        const owner = await this.ownerRepository.findById(id);
        if (!owner) {
            throw new Error("Owner not found");
        }
        await this.ownerRepository.delete(id);
    }
}
