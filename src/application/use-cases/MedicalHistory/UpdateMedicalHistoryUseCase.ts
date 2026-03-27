import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import { MedicalHistory } from "@domain/entities/MedicalHistory.js";

export class UpdateMedicalHistoryUseCase {
    constructor(private readonly medicalHistoryRepository: MedicalHistoryRepository) { }

    async execute(id: string, data: { 
        reason?: string; 
        diagnosis?: string; 
        treatment?: string; 
        observations?: string 
    }): Promise<void> {
        const medicalHistory = await this.medicalHistoryRepository.findById(id);
        if (!medicalHistory) {
            throw new Error("Medical history not found");
        }

        medicalHistory.update(data);
        await this.medicalHistoryRepository.update(medicalHistory);
    }
}
