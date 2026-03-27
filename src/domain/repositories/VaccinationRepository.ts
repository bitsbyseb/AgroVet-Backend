import { Vaccination } from "../entities/Vaccination.js";

export interface VaccinationRepository {
    save(vaccination: Vaccination): Promise<void>;
    findById(id: string): Promise<Vaccination | null>;
    findByAnimalId(animalId: string): Promise<Vaccination[]>;
    findAll(): Promise<Vaccination[]>;
    update(vaccination: Vaccination): Promise<void>;
    delete(id: string): Promise<void>;
}
