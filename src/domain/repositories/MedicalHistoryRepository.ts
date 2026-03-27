import { MedicalHistory } from "../entities/MedicalHistory.js";

export interface MedicalHistoryRepository {
    save(medicalHistory: MedicalHistory): Promise<void>;
    findById(id: string): Promise<MedicalHistory | null>;
    findByAnimalId(animalId: string): Promise<MedicalHistory[]>;
    findAll(): Promise<MedicalHistory[]>;
    update(medicalHistory: MedicalHistory): Promise<void>;
    delete(id: string): Promise<void>;
}
