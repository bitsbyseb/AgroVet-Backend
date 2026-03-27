import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import { MedicalHistory } from "@domain/entities/MedicalHistory.js";

export class ListMedicalHistoriesUseCase {
    constructor(private readonly medicalHistoryRepository: MedicalHistoryRepository) { }

    async execute(): Promise<MedicalHistory[]> {
        return await this.medicalHistoryRepository.findAll();
    }

    async executeByAnimal(animalId: string): Promise<MedicalHistory[]> {
        return await this.medicalHistoryRepository.findByAnimalId(animalId);
    }
}
