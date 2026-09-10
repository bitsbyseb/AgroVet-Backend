import { Vaccination } from "../../../domain/entities/Vaccination.js";
import { randomUUID } from "node:crypto";
export class RegisterVaccinationUseCase {
    vaccinationRepository;
    animalRepository;
    constructor(vaccinationRepository, animalRepository) {
        this.vaccinationRepository = vaccinationRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error("Animal not found");
        }
        const vaccination = new Vaccination(randomUUID(), request.animalId, request.vaccineName, request.applicationDate, request.nextDoseDate, request.batchNumber, request.administeredBy);
        await this.vaccinationRepository.save(vaccination);
    }
}
