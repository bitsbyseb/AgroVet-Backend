import { MedicalHistory, type PhysiologicalConstants } from "@domain/entities/MedicalHistory.js";
import type { MedicalHistoryRepository } from "@domain/repositories/MedicalHistoryRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import { randomUUID } from "node:crypto";

export class RegisterMedicalHistoryUseCase {
    constructor(
        private readonly medicalHistoryRepository: MedicalHistoryRepository,
        private readonly animalRepository: AnimalRepository
    ) { }

    async execute(request: { 
        animalId: string; 
        date: Date; 
        reason: string; 
        diagnosis: string; 
        treatment: string; 
        observations: string; 
        createdBy: string;
        evolution?: string | null;
        physiologicalConstants?: PhysiologicalConstants | null;
        weight?: number | null;
        bodyConditionScore?: number | null;
    }): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }

        const medicalHistory = new MedicalHistory(
            randomUUID(),
            request.animalId,
            request.date,
            request.reason,
            request.diagnosis,
            request.treatment,
            request.observations,
            request.createdBy,
            request.evolution ?? null,
            request.physiologicalConstants ?? null,
            request.weight ?? null,
            request.bodyConditionScore ?? null
        );

        await this.medicalHistoryRepository.save(medicalHistory);
    }
}
