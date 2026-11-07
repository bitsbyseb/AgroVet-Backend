import { randomUUID } from "node:crypto";
import { Reproduction, ReproductiveStatus, BreedingType } from "@domain/entities/Reproduction.js";
import type { ReproductionRepository } from "@domain/repositories/ReproductionRepository.js";
import type { AnimalRepository } from "@domain/repositories/AnimalRepository.js";

export interface RegisterReproductiveEventInput {
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
    gestationDays?: number;
}

export class RegisterReproductiveEventUseCase {
    constructor(
        private readonly reproductionRepository: ReproductionRepository,
        private readonly animalRepository: AnimalRepository
    ) {}

    async execute(request: RegisterReproductiveEventInput): Promise<Reproduction> {
        if (!request.animalId || request.animalId.trim() === '') {
            throw new Error("Animal ID is required");
        }

        const animal = await this.animalRepository.findById(request.animalId);
        if (!animal) {
            throw new Error(`Animal with ID "${request.animalId}" not found`);
        }

        if (request.offspringCount !== undefined && request.offspringCount < 0) {
            throw new Error("Offspring count cannot be negative");
        }

        const parsedHeatDate = request.heatDate ? new Date(request.heatDate) : null;
        if (parsedHeatDate && isNaN(parsedHeatDate.getTime())) {
            throw new Error("Invalid heatDate format");
        }

        let parsedExpectedCalvingDate = request.expectedCalvingDate ? new Date(request.expectedCalvingDate) : null;
        if (parsedExpectedCalvingDate && isNaN(parsedExpectedCalvingDate.getTime())) {
            throw new Error("Invalid expectedCalvingDate format");
        }

        // Si se especifican ambas fechas, validar que el parto sea posterior al celo
        if (parsedHeatDate && parsedExpectedCalvingDate && parsedExpectedCalvingDate <= parsedHeatDate) {
            throw new Error("Expected calving date must be after heat date");
        }

        const reproduction = new Reproduction(
            request.id ?? randomUUID(),
            request.animalId,
            request.reproductiveStatus,
            request.lastCalvingDate ?? null,
            request.offspringCount ?? 0,
            request.breedingType ?? null,
            parsedHeatDate,
            parsedExpectedCalvingDate,
            request.bullId ? request.bullId.trim() : null,
            request.semenBatch ? request.semenBatch.trim() : null,
            request.inseminationDetails ? request.inseminationDetails.trim() : null
        );

        // Si hay fecha de celo pero no fecha probable de parto, y el animal está gestante o tuvo monta/inseminación,
        // calcular automáticamente la fecha estimada de parto basada en la duración de la gestación
        if (parsedHeatDate && !parsedExpectedCalvingDate) {
            const isBreedingEvent = reproduction.breedingType !== null || reproduction.reproductiveStatus === ReproductiveStatus.PREGNANT;
            if (isBreedingEvent) {
                reproduction.calculateExpectedCalvingDate(parsedHeatDate, request.gestationDays ?? 283);
            }
        }

        await this.reproductionRepository.save(reproduction);
        return reproduction;
    }
}
