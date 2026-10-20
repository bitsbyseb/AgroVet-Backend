import type { GrazingActivity } from "@domain/entities/GrazingActivity.js";
import type { GrazingActivityRepository } from "@domain/repositories/GrazingActivityRepository.js";

export class GetGrazingActivitiesUseCase {
    constructor(private readonly grazingActivityRepository: GrazingActivityRepository) {}

    async execute(paddockId?: string): Promise<GrazingActivity[]> {
        if (paddockId && paddockId.trim() !== '') {
            return await this.grazingActivityRepository.findByPaddockId(paddockId.trim());
        }
        return await this.grazingActivityRepository.findAll();
    }
}
