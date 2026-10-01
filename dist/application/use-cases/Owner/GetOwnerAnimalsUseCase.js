import { animalType, speciesType, Gender, Status } from "../../../domain/entities/Animal.js";
/**
 * Caso de Uso (Sprint 11): Permite que un usuario autenticado con rol OWNER
 * consulte únicamente los animales que le pertenecen a través de su userId JWT.
 *
 * Flujo:
 *  1. Recibe el userId extraído del token JWT.
 *  2. Busca el registro Owner vinculado a ese userId.
 *  3. Retorna los animales de ese ownerId con su información básica y estado de salud.
 */
export class GetOwnerAnimalsUseCase {
    ownerRepository;
    animalRepository;
    constructor(ownerRepository, animalRepository) {
        this.ownerRepository = ownerRepository;
        this.animalRepository = animalRepository;
    }
    async execute(userId) {
        // 1. Resolver el perfil de propietario asociado al usuario autenticado
        const owner = await this.ownerRepository.findByUserId(userId);
        if (!owner) {
            throw new Error("No se encontró un perfil de propietario asociado a este usuario.");
        }
        // 2. Consultar sólo los animales que pertenecen a ese propietario
        const animals = await this.animalRepository.findByOwnerId(owner.id);
        // 3. Proyectar los datos relevantes (lectura tipada con birthDate en formato ISO string)
        return animals.map((animal) => ({
            id: animal.id,
            name: animal.name,
            species: animal.species,
            animalType: animal.animalType,
            breed: animal.breed,
            gender: animal.gender,
            birthDate: animal.birthDate instanceof Date ? animal.birthDate.toISOString() : String(animal.birthDate),
            status: animal.status,
            color: animal.color,
            ownerId: animal.ownerId,
            paddockId: animal.paddockId ?? null
        }));
    }
}
