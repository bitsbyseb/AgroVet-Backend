/**
 * Caso de Uso (Sprint 11): Permite que un usuario autenticado con rol OWNER
 * consulte el historial clínico completo de uno de sus animales.
 *
 * Flujo:
 *  1. Recibe el userId (del token JWT) y el animalId a consultar.
 *  2. Resuelve el ownerId vinculado al userId.
 *  3. Verifica que el animal pertenezca estrictamente al ownerId resuelto.
 *     Si no pertenece, lanza una excepción de acceso no autorizado (403).
 *  4. Retorna el historial clínico completo en modo solo lectura con fechas serializadas.
 */
export class GetOwnerMedicalHistoryUseCase {
    ownerRepository;
    animalRepository;
    medicalHistoryRepository;
    constructor(ownerRepository, animalRepository, medicalHistoryRepository) {
        this.ownerRepository = ownerRepository;
        this.animalRepository = animalRepository;
        this.medicalHistoryRepository = medicalHistoryRepository;
    }
    async execute(userId, animalId) {
        // 1. Resolver el perfil de propietario del usuario autenticado
        const owner = await this.ownerRepository.findByUserId(userId);
        if (!owner) {
            throw new Error("No se encontró un perfil de propietario asociado a este usuario.");
        }
        // 2. Obtener el animal solicitado
        const animal = await this.animalRepository.findById(animalId);
        if (!animal) {
            throw new Error(`El animal con ID "${animalId}" no fue encontrado.`);
        }
        // 3. Verificación estricta de pertenencia: el animal debe pertenecer a ESTE propietario
        if (animal.ownerId !== owner.id) {
            throw new Error("Acceso no autorizado: el animal solicitado no pertenece a este propietario.");
        }
        // 4. Recuperar y proyectar el historial clínico completo (solo lectura)
        const histories = await this.medicalHistoryRepository.findByAnimalId(animalId);
        return histories.map((entry) => ({
            id: entry.id,
            animalId: entry.animalId,
            date: entry.date instanceof Date ? entry.date.toISOString() : String(entry.date),
            reason: entry.reason,
            diagnosis: entry.diagnosis,
            treatment: entry.treatment,
            observations: entry.observations,
            createdBy: entry.createdBy,
            createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : undefined,
            updatedAt: entry.updatedAt instanceof Date ? entry.updatedAt.toISOString() : undefined
        }));
    }
}
