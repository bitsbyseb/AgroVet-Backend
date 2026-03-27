import { Vaccination } from "@domain/entities/Vaccination.js";
import type { VaccinationRepository } from "@domain/repositories/VaccinationRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";
import { randomUUID } from "node:crypto";

export class RegisterVaccinationUseCase {
    constructor(
        private readonly vaccinationRepository: VaccinationRepository,
        private readonly animalRepository: AnimalRepository
    ) { }

    async execute(request: { 
        animalId: string; 
        vaccineName: string; 
        applicationDate: Date; 
        nextDoseDate: Date | null; 
        batchNumber: string | null; 
        administeredBy: string 
    }): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }

        const vaccination = new Vaccination(
            randomUUID(),
            request.animalId,
            request.vaccineName,
            request.applicationDate,
            request.nextDoseDate,
            request.batchNumber,
            request.administeredBy
        );

        await this.vaccinationRepository.save(vaccination);
    }
}
