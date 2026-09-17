import { GrazingActivity } from "@domain/entities/GrazingActivity.js";
import { PaddockStatus } from "@domain/entities/Paddock.js";
import type { GrazingActivityRepository } from "@domain/repositories/GrazingActivityRepository.js";
import type { PaddockRepository } from "@domain/repositories/PaddockRepository.js";
import { randomUUID } from "node:crypto";

export interface RegisterGrazingActivityDTO {
    id?: string;
    paddockId: string;
    animalIds: string[];
    entryDate: Date | string;
    exitDate?: Date | string | null;
    rotationNumber: number;
    observations?: string | null;
}

export class RegisterGrazingActivityUseCase {
    constructor(
        private readonly grazingActivityRepository: GrazingActivityRepository,
        private readonly paddockRepository: PaddockRepository
    ) {}

    async execute(request: RegisterGrazingActivityDTO): Promise<GrazingActivity> {
        const paddock = await this.paddockRepository.findById(request.paddockId);
        if (!paddock) {
            throw new Error('Paddock not found');
        }

        if (paddock.status === PaddockStatus.MAINTENANCE) {
            throw new Error('Cannot register grazing activity for a paddock in MAINTENANCE status');
        }

        const entryDate = typeof request.entryDate === 'string' ? new Date(request.entryDate) : request.entryDate;
        if (!entryDate || isNaN(entryDate.getTime())) {
            throw new Error('Invalid entry date');
        }

        let exitDate: Date | null = null;
        if (request.exitDate !== undefined && request.exitDate !== null) {
            exitDate = typeof request.exitDate === 'string' ? new Date(request.exitDate) : request.exitDate;
            if (isNaN(exitDate.getTime())) {
                throw new Error('Invalid exit date');
            }
        }

        const id = request.id || randomUUID();

        const grazingActivity = new GrazingActivity(
            id,
            request.paddockId,
            request.animalIds,
            entryDate,
            exitDate,
            request.rotationNumber,
            request.observations ?? null
        );

        await this.grazingActivityRepository.save(grazingActivity);

        return grazingActivity;
    }
}
