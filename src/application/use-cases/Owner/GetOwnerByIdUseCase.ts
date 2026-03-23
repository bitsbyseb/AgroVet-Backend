import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

export class GetOwnerByIdUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(id: string) {
        const owner = await this.ownerRepository.findById(id);
        if (!owner) {
            throw new Error("Owner not found");
        }

        return {
            id: owner.id,
            name: owner.name,
            document: owner.document,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType,
            createdAt: owner.createdAt
        };
    }
}
