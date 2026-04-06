import { ProductionData } from "@domain/entities/ProductionData.js";

export interface ProductionDataRepository {
    save(productionData: ProductionData): Promise<void>;
    findByAnimalId(animalId: string): Promise<ProductionData[]>;
}
