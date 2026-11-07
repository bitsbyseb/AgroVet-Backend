import { randomUUID } from "node:crypto";
import { Reproduction, ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";
import type { ReproductionRepository } from "@domain/repositories/ReproductionRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export interface RegisterReproductionInput {
    id?: string;
    animalId: string;
    reproductiveStatus: ReproductiveStatus;
    lastCalvingDate?: string | null;
    offspringCount?: number;
    breedingType?: BreedingType | null;
    heatDate?: Date | string | null;
    expectedCalvingDate?: Date | string | null;
    bullId?: string | null;
    semenBatch?: string | null;
    inseminationDetails?: string | null;
}

export class RegisterReproductionUseCase {
    constructor(
        private readonly reproductionRepository: ReproductionRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(request: RegisterReproductionInput): Promise<void> {
        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) throw new Error("Animal not found");

        const parsedHeatDate = request.heatDate ? new Date(request.heatDate) : null;
        let parsedExpectedCalvingDate = request.expectedCalvingDate ? new Date(request.expectedCalvingDate) : null;

        const reproduction = new Reproduction(
            request.id ?? randomUUID(),
            request.animalId,
            request.reproductiveStatus,
            request.lastCalvingDate ?? null,
            request.offspringCount ?? 0,
            request.breedingType ?? null,
            parsedHeatDate,
            parsedExpectedCalvingDate,
            request.bullId ?? null,
            request.semenBatch ?? null,
            request.inseminationDetails ?? null
        );

        if (parsedHeatDate && !parsedExpectedCalvingDate && reproduction.reproductiveStatus === ReproductiveStatus.PREGNANT) {
            reproduction.calculateExpectedCalvingDate();
        }

        await this.reproductionRepository.save(reproduction);
    }
}
