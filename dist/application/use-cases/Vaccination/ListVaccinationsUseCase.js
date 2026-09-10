import { Vaccination } from "../../../domain/entities/Vaccination.js";
export class ListVaccinationsUseCase {
    vaccinationRepository;
    constructor(vaccinationRepository) {
        this.vaccinationRepository = vaccinationRepository;
    }
    async execute() {
        return await this.vaccinationRepository.findAll();
    }
    async executeByAnimal(animalId) {
        return await this.vaccinationRepository.findByAnimalId(animalId);
    }
}
