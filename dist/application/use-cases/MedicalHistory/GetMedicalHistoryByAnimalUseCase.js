/**
 * Caso de Uso (Sprint 17 - HU8/HU9):
 * Permite consultar el historial clínico enriquecido de un animal específico.
 */
export class GetMedicalHistoryByAnimalUseCase {
    medicalHistoryRepository;
    animalRepository;
    constructor(medicalHistoryRepository, animalRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
        this.animalRepository = animalRepository;
    }
    async execute(animalId) {
        if (!animalId || animalId.trim() === '') {
            throw new Error("Animal ID is required");
        }
        const animal = await this.animalRepository.findById(animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }
        return await this.medicalHistoryRepository.findByAnimalId(animalId);
    }
}
