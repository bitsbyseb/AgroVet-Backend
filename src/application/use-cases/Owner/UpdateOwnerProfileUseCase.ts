import { OwnerType } from '@domain/entities/Owner.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';

/** DTO de entrada para actualización — pertenece a la capa de aplicación, no a infraestructura. */
export interface UpdateOwnerDTO {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    ownerType?: OwnerType;
}

export class UpdateOwnerProfileUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(id: string, request: UpdateOwnerDTO): Promise<void> {
        const owner = await this.ownerRepository.findById(id);
        if (!owner) {
            throw new Error('Owner not found');
        }

        owner.updateDetails(request);
        await this.ownerRepository.update(owner);
    }
}
