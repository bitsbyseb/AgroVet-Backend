import { Owner } from "@domain/entities/Owner.js";
import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

export class RegisterOwnerUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(request: any): Promise<void> {
        const existingOwner = await this.ownerRepository.findByDocument(request.document);
        if (existingOwner) {
            throw new Error("Owner with this document already exists");
        }

        const owner = new Owner(
            request.id,
            request.name,
            request.document,
            request.phone,
            request.email,
            request.address,
            request.ownerType
        );

        await this.ownerRepository.save(owner);
    }
}
