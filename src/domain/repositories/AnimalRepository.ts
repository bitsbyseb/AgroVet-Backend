import { Animal } from "../entities/Animal.js";

export interface AnimalRepository {
    save(animal: Animal): Promise<void>;
    findById(id: string): Promise<Animal | null>;
    findByOwnerId(ownerId: string): Promise<Animal[]>;
    findAll(): Promise<Animal[]>;
    update(animal: Animal): Promise<void>;
    delete(id: string): Promise<void>;
}
