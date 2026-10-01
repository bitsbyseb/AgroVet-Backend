import { Owner } from "../entities/Owner.js";

export interface OwnerRepository {
    save(owner: Owner): Promise<void>;
    findById(id: string): Promise<Owner | null>;
    findByDocument(document: string): Promise<Owner | null>;
    findByEmail(email: string): Promise<Owner | null>;
    findByUserId(userId: string): Promise<Owner | null>;
    findAll(): Promise<Owner[]>;
    update(owner: Owner): Promise<void>;
    delete(id: string): Promise<void>;
}
