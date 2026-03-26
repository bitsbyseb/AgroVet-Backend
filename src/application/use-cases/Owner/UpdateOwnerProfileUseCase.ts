import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";
import type { ownerUpdateType } from "@infrastructure/http/hono/validators/OwnerValidator.js";

export class UpdateOwnerProfileUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(id: string, request: ownerUpdateType): Promise<void> {
        const owner = await this.ownerRepository.findById(id);
        if (!owner) {
            throw new Error("Owner not found");
        }

        owner.updateDetails(request);
        await this.ownerRepository.update(owner);
    }
}
