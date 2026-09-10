import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
import { randomUUID } from "node:crypto";
export class RegisterMedicalHistoryUseCase {
    medicalHistoryRepository;
    animalRepository;
    constructor(medicalHistoryRepository, animalRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }
        const medicalHistory = new MedicalHistory(randomUUID(), request.animalId, request.date, request.reason, request.diagnosis, request.treatment, request.observations, request.createdBy);
        await this.medicalHistoryRepository.save(medicalHistory);
    }
}
