import { MedicalHistory } from "../../../domain/entities/MedicalHistory.js";
import { randomUUID } from "node:crypto";
export class CreateMedicalHistoryUseCase {
    medicalHistoryRepository;
    animalRepository;
    constructor(medicalHistoryRepository, animalRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        // 1. Validar existencia del animal
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }
        // 2. Validar medidas corporales
        if (request.weight !== undefined && request.weight !== null && request.weight <= 0) {
            throw new Error("Weight must be a positive number");
        }
        if (request.bodyConditionScore !== undefined && request.bodyConditionScore !== null && request.bodyConditionScore <= 0) {
            throw new Error("Body condition score must be a positive number");
        }
        // 3. Consolidar constantes fisiológicas (objeto completo + campos atómicos opcionales)
        const consolidatedConstants = {
            ...(request.physiologicalConstants || {}),
            ...(request.heartRate !== undefined ? { heartRate: request.heartRate } : {}),
            ...(request.respiratoryRate !== undefined ? { respiratoryRate: request.respiratoryRate } : {}),
            ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
            ...(request.capillaryRefillTime !== undefined ? { capillaryRefillTime: request.capillaryRefillTime } : {}),
            ...(request.mucosalState !== undefined ? { mucosalState: request.mucosalState } : {})
        };
        const hasConstants = Object.keys(consolidatedConstants).length > 0;
        // 4. Crear entidad de dominio enriquecida (HU8)
        const parsedDate = request.date instanceof Date ? request.date : new Date(request.date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format");
        }
        const medicalHistory = new MedicalHistory(randomUUID(), request.animalId, parsedDate, request.reason, request.diagnosis, request.treatment, request.observations ?? '', request.createdBy, request.evolution ?? null, hasConstants ? consolidatedConstants : null, request.weight ?? null, request.bodyConditionScore ?? null);
        // 5. Persistir en repositorio
        await this.medicalHistoryRepository.save(medicalHistory);
        return medicalHistory;
    }
}
