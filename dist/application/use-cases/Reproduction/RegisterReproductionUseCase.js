import { randomUUID } from "node:crypto";
import { Reproduction, ReproductiveStatus, BreedingType } from "../../../domain/entities/Reproduction.js";
export class RegisterReproductionUseCase {
    reproductionRepository;
    animalRepository;
    constructor(reproductionRepository, animalRepository) {
        this.reproductionRepository = reproductionRepository;
        this.animalRepository = animalRepository;
    }
    async execute(request) {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal)
            throw new Error("Animal not found");
        const parsedHeatDate = request.heatDate ? new Date(request.heatDate) : null;
        let parsedExpectedCalvingDate = request.expectedCalvingDate ? new Date(request.expectedCalvingDate) : null;
        const reproduction = new Reproduction(request.id ?? randomUUID(), request.animalId, request.reproductiveStatus, request.lastCalvingDate ?? null, request.offspringCount ?? 0, request.breedingType ?? null, parsedHeatDate, parsedExpectedCalvingDate, request.bullId ?? null, request.semenBatch ?? null, request.inseminationDetails ?? null);
        if (parsedHeatDate && !parsedExpectedCalvingDate && reproduction.reproductiveStatus === ReproductiveStatus.PREGNANT) {
            reproduction.calculateExpectedCalvingDate();
        }
        await this.reproductionRepository.save(reproduction);
    }
}
