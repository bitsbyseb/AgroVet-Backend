import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import { MedicalHistory, type PhysiologicalConstants } from "@domain/entities/MedicalHistory.js";

export interface UpdateMedicalHistoryRequest {
    reason?: string;
    diagnosis?: string;
    treatment?: string;
    observations?: string;
    evolution?: string | null;
    physiologicalConstants?: PhysiologicalConstants | null;
    weight?: number | null;
    bodyConditionScore?: number | null;
    heartRate?: number | null;
    respiratoryRate?: number | null;
    temperature?: number | null;
    capillaryRefillTime?: number | null;
    mucosalState?: string | null;
}

export class UpdateMedicalHistoryUseCase {
    constructor(private readonly medicalHistoryRepository: MedicalHistoryRepository) { }

    async execute(id: string, data: UpdateMedicalHistoryRequest): Promise<MedicalHistory> {
        if (!id || id.trim() === '') {
            throw new Error("Medical history ID is required");
        }

        const medicalHistory = await this.medicalHistoryRepository.findById(id);
        if (!medicalHistory) {
            throw new Error("Medical history not found");
        }

        // Validaciones de medidas en caso de actualización
        if (data.weight !== undefined && data.weight !== null && data.weight <= 0) {
            throw new Error("Weight must be a positive number");
        }
        if (data.bodyConditionScore !== undefined && data.bodyConditionScore !== null && data.bodyConditionScore <= 0) {
            throw new Error("Body condition score must be a positive number");
        }

        medicalHistory.update(data);
        await this.medicalHistoryRepository.update(medicalHistory);

        return medicalHistory;
    }
}
