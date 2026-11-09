import { ProductionData } from "@domain/entities/ProductionData.js";

export interface ProductionDataRepository {
    save(productionData: ProductionData): Promise<void>;
    findByAnimalId(animalId: string): Promise<ProductionData[]>;
    findByAnimalIdAndPeriod(animalId: string, from: Date, to: Date): Promise<ProductionData[]>;
}
