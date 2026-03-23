import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

export class ListAllOwnersUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute() {
        const owners = await this.ownerRepository.findAll();
        return owners.map(owner => ({
            id: owner.id,
            name: owner.name,
            document: owner.document,
            phone: owner.phone,
            email: owner.email,
            address: owner.address,
            ownerType: owner.ownerType
        }));
    }
}
