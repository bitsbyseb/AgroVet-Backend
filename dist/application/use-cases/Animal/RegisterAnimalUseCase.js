import { Animal } from "../../../domain/entities/Animal.js";
export class RegisterAnimalUseCase {
    animalRepository;
    ownerRepository;
    constructor(animalRepository, ownerRepository) {
        this.animalRepository = animalRepository;
        this.ownerRepository = ownerRepository;
    }
    async execute(request) {
        const owner = await this.ownerRepository.findById(request.ownerId);
        if (!owner) {
            throw new Error("Propietario no encontrado");
        }
        const parsedBirthDate = new Date(request.birthDate);
        if (isNaN(parsedBirthDate.getTime())) {
            throw new Error("Fecha de nacimiento no válida");
        }
        const animal = new Animal(crypto.randomUUID(), // El ID se genera en el backend
        request.name, request.species, request.animalType, request.breed, request.gender, parsedBirthDate, // Date validado
        undefined, // status por defecto
        request.color, request.ownerId, request.paddockId || null);
        await this.animalRepository.save(animal);
    }
}
