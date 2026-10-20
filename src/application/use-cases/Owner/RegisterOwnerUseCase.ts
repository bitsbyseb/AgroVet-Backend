import { Owner, OwnerType } from '@domain/entities/Owner.js';
import type { OwnerRepository } from '@domain/repositories/OwnerRepository.js';
import { randomUUID } from 'node:crypto';

/** DTO de entrada para el caso de uso — pertenece a la capa de aplicación, no a infraestructura. */
export interface RegisterOwnerDTO {
    name: string;
    document: string;
    phone: string;
    email: string;
    address: string;
    ownerType: OwnerType;
}

export class RegisterOwnerUseCase {
    constructor(private readonly ownerRepository: OwnerRepository) {}

    async execute(request: RegisterOwnerDTO): Promise<string> {
        const existingOwner = await this.ownerRepository.findByDocument(request.document);
        if (existingOwner) {
            throw new Error('Ya existe un propietario con este número de documento');
        }

        const existingOwnerByEmail = await this.ownerRepository.findByEmail(request.email);
        if (existingOwnerByEmail) {
            throw new Error('Ya existe un propietario registrado con este correo electrónico');
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
