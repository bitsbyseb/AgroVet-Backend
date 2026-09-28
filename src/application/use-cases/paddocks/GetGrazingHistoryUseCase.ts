import type { GrazingActivity } from "@domain/entities/GrazingActivity.js";
import type { GrazingActivityRepository, IGrazingFilters } from "@domain/repositories/GrazingActivityRepository.js";

export interface GrazingPermanenceTime {
    days: number;
    hours: number;
    totalHours: number;
    inProgress: boolean;
    formatted: string;
}

export interface GrazingHistoryItemDTO {
    id: string;
    paddockId: string;
    animalIds: string[];
    entryDate: Date;
    exitDate: Date | null;
    rotationNumber: number;
    observations: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    permanenceTime: GrazingPermanenceTime;
}

export class GetGrazingHistoryUseCase {
    constructor(private readonly grazingActivityRepository: GrazingActivityRepository) {}

    async execute(filters: IGrazingFilters = {}, referenceDate?: Date): Promise<GrazingHistoryItemDTO[]> {
        if (filters.startDate) {
            const start = new Date(filters.startDate);
            if (isNaN(start.getTime())) {
                throw new Error('Invalid startDate filter');
            }
        }

        if (filters.endDate) {
            const end = new Date(filters.endDate);
            if (isNaN(end.getTime())) {
                throw new Error('Invalid endDate filter');
            }
        }

        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            if (start.getTime() > end.getTime()) {
                throw new Error('startDate cannot be after endDate');
            }
        }

        const activities = await this.grazingActivityRepository.findHistory(filters);

        return activities.map((activity) => {
            const permanenceTime = typeof activity.getPermanenceTime === 'function'
                ? activity.getPermanenceTime(referenceDate)
                : this.calculatePermanenceTime(activity.entryDate, activity.exitDate, referenceDate);

            return {
                id: activity.id,
                paddockId: activity.paddockId,
                animalIds: activity.animalIds,
                entryDate: activity.entryDate,
                exitDate: activity.exitDate,
                rotationNumber: activity.rotationNumber,
                observations: activity.observations,
                createdAt: activity.createdAt,
                updatedAt: activity.updatedAt,
                permanenceTime
            };
        });
    }

    private calculatePermanenceTime(entryDate: Date, exitDate: Date | null, referenceDate: Date = new Date()): GrazingPermanenceTime {
        const inProgress = exitDate === null || exitDate === undefined;
        const end = exitDate ? new Date(exitDate).getTime() : referenceDate.getTime();
        const start = new Date(entryDate).getTime();
        const diffMs = Math.max(0, end - start);
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;

        let formatted = '';
        if (days > 0 && hours > 0) {
            formatted = `${days} día${days !== 1 ? 's' : ''}, ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else if (days > 0) {
            formatted = `${days} día${days !== 1 ? 's' : ''}`;
        } else {
            formatted = `${hours} hora${hours !== 1 ? 's' : ''}`;
        }

        if (inProgress) {
            formatted += ' (en curso)';
        }

        return {
            days,
            hours,
            totalHours,
            inProgress,
            formatted
        };
    }
}
