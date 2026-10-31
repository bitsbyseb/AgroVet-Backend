import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import type { MedicalHistory } from "@domain/entities/MedicalHistory.js";

/**
 * Caso de Uso (Sprint 17 - HU8/HU9):
 * Permite consultar el historial clínico enriquecido de un animal específico.
 */
export class GetMedicalHistoryByAnimalUseCase {
    constructor(
        private readonly medicalHistoryRepository: MedicalHistoryRepository,
        private readonly animalRepository: AnimalRepository
    ) { }

    async execute(animalId: string): Promise<MedicalHistory[]> {
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
