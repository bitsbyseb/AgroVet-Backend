import { Owner } from '../../../domain/entities/Owner.js';
import { randomUUID } from "crypto";
export class RegisterOwnerUseCase {
    ownerRepository;
    constructor(ownerRepository) {
        this.ownerRepository = ownerRepository;
    }
    async execute(request) {
        const existingOwner = await this.ownerRepository.findByDocument(request.document);
        if (existingOwner) {
            throw new Error('Ya existe un propietario con este número de documento');
        }
        const existingOwnerByEmail = await this.ownerRepository.findByEmail(request.email);
        if (existingOwnerByEmail) {
            throw new Error('Ya existe un propietario registrado con este correo electrónico');
        }
        const id = randomUUID();
        const owner = new Owner(id, request.name, request.document, request.phone, request.email, request.address, request.ownerType);
        await this.ownerRepository.save(owner);
        return id;
    }
}
