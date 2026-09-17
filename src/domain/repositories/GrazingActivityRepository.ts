import type { GrazingActivity } from "../entities/GrazingActivity.js";

export interface GrazingActivityRepository {
    save(activity: GrazingActivity): Promise<void>;
    findById(id: string): Promise<GrazingActivity | null>;
    findByPaddockId(paddockId: string): Promise<GrazingActivity[]>;
    findActiveByPaddockId(paddockId: string): Promise<GrazingActivity | null>;
    findByAnimalId(animalId: string): Promise<GrazingActivity[]>;
    findAll(): Promise<GrazingActivity[]>;
    update(activity: GrazingActivity): Promise<void>;
    delete(id: string): Promise<void>;
}
