import { Alimentation } from "@domain/entities/Alimentation.js";

export interface AlimentationRepository {
    save(alimentation: Alimentation): Promise<void>;
    findByAnimalId(animalId: string): Promise<Alimentation[]>;
}
