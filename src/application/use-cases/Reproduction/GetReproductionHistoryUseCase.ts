import { Reproduction } from "@domain/entities/Reproduction.js";
import type { ReproductionRepository } from "@domain/repositories/ReproductionRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export class GetReproductionHistoryUseCase {
    constructor(
        private readonly reproductionRepository: ReproductionRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(animalId: string, order: 'asc' | 'desc' = 'desc'): Promise<Reproduction[]> {
        if (!animalId || animalId.trim() === '') {
            throw new Error("Animal ID is required");
        }

        const animal = await this.animalRepository.findById(animalId);
        if (!animal) {
            throw new Error(`Animal with ID "${animalId}" not found`);
        }

        const records = await this.reproductionRepository.findByAnimalId(animalId);

        // Ordenamiento cronológico determinando la fecha más relevante del registro
        return [...records].sort((a, b) => {
            const timeA = this.resolveEventTimestamp(a);
            const timeB = this.resolveEventTimestamp(b);

            return order === 'asc' ? timeA - timeB : timeB - timeA;
        });
    }

    private resolveEventTimestamp(record: Reproduction): number {
        if (record.heatDate) {
            return new Date(record.heatDate).getTime();
        }
        if (record.expectedCalvingDate) {
            return new Date(record.expectedCalvingDate).getTime();
        }
        if (record.lastCalvingDate) {
            const d = new Date(record.lastCalvingDate);
            if (!isNaN(d.getTime())) return d.getTime();
        }
        if (record.createdAt) {
            return new Date(record.createdAt).getTime();
        }
        return 0;
    }
}
