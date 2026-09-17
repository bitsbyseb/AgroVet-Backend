import { GrazingActivity } from "../../../domain/entities/GrazingActivity.js";
import { PaddockStatus } from "../../../domain/entities/Paddock.js";
import { randomUUID } from "node:crypto";
export class RegisterGrazingActivityUseCase {
    grazingActivityRepository;
    paddockRepository;
    constructor(grazingActivityRepository, paddockRepository) {
        this.grazingActivityRepository = grazingActivityRepository;
        this.paddockRepository = paddockRepository;
    }
    async execute(request) {
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
        let exitDate = null;
        if (request.exitDate !== undefined && request.exitDate !== null) {
            exitDate = typeof request.exitDate === 'string' ? new Date(request.exitDate) : request.exitDate;
            if (isNaN(exitDate.getTime())) {
                throw new Error('Invalid exit date');
            }
        }
        const id = request.id || randomUUID();
        const grazingActivity = new GrazingActivity(id, request.paddockId, request.animalIds, entryDate, exitDate, request.rotationNumber, request.observations ?? null);
        await this.grazingActivityRepository.save(grazingActivity);
        return grazingActivity;
    }
}
