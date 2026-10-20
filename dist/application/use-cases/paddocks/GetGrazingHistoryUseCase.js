export class GetGrazingHistoryUseCase {
    grazingActivityRepository;
    constructor(grazingActivityRepository) {
        this.grazingActivityRepository = grazingActivityRepository;
    }
    async execute(filters = {}, referenceDate) {
        const normalizedFilters = {};
        if (filters.paddockId && typeof filters.paddockId === 'string' && filters.paddockId.trim() !== '' && filters.paddockId !== 'ALL') {
            normalizedFilters.paddockId = filters.paddockId.trim();
        }
        if (filters.animalId && typeof filters.animalId === 'string' && filters.animalId.trim() !== '' && filters.animalId !== 'ALL') {
            normalizedFilters.animalId = filters.animalId.trim();
        }
        if (filters.startDate !== undefined && filters.startDate !== null && filters.startDate !== '') {
            const start = new Date(filters.startDate);
            if (isNaN(start.getTime())) {
                throw new Error('Invalid startDate filter');
            }
            normalizedFilters.startDate = filters.startDate;
        }
        if (filters.endDate !== undefined && filters.endDate !== null && filters.endDate !== '') {
            const end = new Date(filters.endDate);
            if (isNaN(end.getTime())) {
                throw new Error('Invalid endDate filter');
            }
            normalizedFilters.endDate = filters.endDate;
        }
        if (normalizedFilters.startDate && normalizedFilters.endDate) {
            const start = new Date(normalizedFilters.startDate);
            const end = new Date(normalizedFilters.endDate);
            if (start.getTime() > end.getTime()) {
                throw new Error('startDate cannot be after endDate');
            }
        }
        const activities = await this.grazingActivityRepository.findHistory(normalizedFilters);
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
    calculatePermanenceTime(entryDate, exitDate, referenceDate = new Date()) {
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
        }
        else if (days > 0) {
            formatted = `${days} día${days !== 1 ? 's' : ''}`;
        }
        else {
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
