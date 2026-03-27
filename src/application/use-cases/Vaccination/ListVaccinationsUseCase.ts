import type { VaccinationRepository } from "@domain/repositories/VaccinationRepository.js";
import { Vaccination } from "@domain/entities/Vaccination.js";

export class ListVaccinationsUseCase {
    constructor(private readonly vaccinationRepository: VaccinationRepository) { }

    async execute(): Promise<Vaccination[]> {
        return await this.vaccinationRepository.findAll();
    }

    async executeByAnimal(animalId: string): Promise<Vaccination[]> {
        return await this.vaccinationRepository.findByAnimalId(animalId);
    }
}
