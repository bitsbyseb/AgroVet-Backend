import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
export class ListMedicalHistoriesUseCase {
    medicalHistoryRepository;
    constructor(medicalHistoryRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
    }
    async execute() {
        return await this.medicalHistoryRepository.findAll();
    }
    async executeByAnimal(animalId) {
        return await this.medicalHistoryRepository.findByAnimalId(animalId);
    }
}
