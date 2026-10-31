import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
export class UpdateMedicalHistoryUseCase {
    medicalHistoryRepository;
    constructor(medicalHistoryRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
    }
    async execute(id, data) {
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
