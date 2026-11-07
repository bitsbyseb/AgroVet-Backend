import { Reproduction } from "../../../domain/entities/Reproduction.js";
export class GetReproductionHistoryUseCase {
    reproductionRepository;
    animalRepository;
    constructor(reproductionRepository, animalRepository) {
        this.reproductionRepository = reproductionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(animalId, order = 'desc') {
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
    resolveEventTimestamp(record) {
        if (record.heatDate) {
            return new Date(record.heatDate).getTime();
        }
        if (record.expectedCalvingDate) {
            return new Date(record.expectedCalvingDate).getTime();
        }
        if (record.lastCalvingDate) {
            const d = new Date(record.lastCalvingDate);
            if (!isNaN(d.getTime()))
                return d.getTime();
        }
        if (record.createdAt) {
            return new Date(record.createdAt).getTime();
        }
        return 0;
    }
}
