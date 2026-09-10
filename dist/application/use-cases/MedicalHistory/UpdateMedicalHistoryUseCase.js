import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
export class UpdateMedicalHistoryUseCase {
    medicalHistoryRepository;
    constructor(medicalHistoryRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
    }
    async execute(id, data) {
        const medicalHistory = await this.medicalHistoryRepository.findById(id);
        if (!medicalHistory) {
            throw new Error("Medical history not found");
        }
        medicalHistory.update(data);
        await this.medicalHistoryRepository.update(medicalHistory);
    }
}
