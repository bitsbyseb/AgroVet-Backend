import { Owner } from '@domain/entities/Owner.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import type { ownerCreationType } from '@infrastructure/http/hono/validators/OwnerValidator.js';
import { randomUUID } from "crypto";

export class RegisterOwnerUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(request: ownerCreationType): Promise<string> {
        const existingOwner = await this.ownerRepository.findByDocument(request.document);
        if (existingOwner) {
            throw new Error("Owner with this document already exists");
        }
        const id = randomUUID();
        const owner = new Owner(
            id,
            request.name,
            request.document,
            request.phone,
            request.email,
            request.address,
            request.ownerType
        );

        await this.ownerRepository.save(owner);
        return id;
    }
}
