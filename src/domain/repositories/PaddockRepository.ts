import type { Paddock } from "../entities/Paddock.js";

export interface PaddockRepository {
    save(paddock: Paddock): Promise<void>;
    findById(id: string): Promise<Paddock | null>;
    findByName(name: string): Promise<Paddock | null>;
    findAll(): Promise<Paddock[]>;
    update(paddock: Paddock): Promise<void>;
    delete(id: string): Promise<void>;
}
