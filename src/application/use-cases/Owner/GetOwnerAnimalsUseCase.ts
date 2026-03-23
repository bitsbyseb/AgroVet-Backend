import type { OwnerRepository } from "@domain/repositories/OwnerRepository.js";

export class GetOwnerAnimalsUseCase {
    constructor(private readonly ownerRepository:OwnerRepository) {}

    async execute() {
        
    }
}