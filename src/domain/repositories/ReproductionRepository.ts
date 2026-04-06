import { Reproduction } from "@domain/entities/Reproduction.js";

export interface ReproductionRepository {
    save(reproduction: Reproduction): Promise<void>;
    findByAnimalId(animalId: string): Promise<Reproduction[]>;
}
