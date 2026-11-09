import { Animal, speciesType, Status } from "../entities/Animal.js";

export interface AnimalSearchParams {
    query?: string;
    name?: string;
    identification?: string;
    species?: speciesType | string;
    ownerId?: string;
    status?: Status | string;
}

export interface AnimalRepository {
    save(animal: Animal): Promise<void>;
    findById(id: string): Promise<Animal | null>;
    findByOwnerId(ownerId: string): Promise<Animal[]>;
    findAll(): Promise<Animal[]>;
    search(params: AnimalSearchParams | string): Promise<Animal[]>;
    update(animal: Animal): Promise<void>;
    delete(id: string): Promise<void>;
}
