export enum PaddockStatus {
    ACTIVE = 'ACTIVE',
    RESTING = 'RESTING',
    MAINTENANCE = 'MAINTENANCE'
}

export class Paddock {
    constructor(
        public readonly id: string,
        public name: string,
        public capacity: number,
        public area: number | null = null,
        public status: PaddockStatus = PaddockStatus.ACTIVE,
        public description: string | null = null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validateCapacity(capacity);
        if (area !== null && area !== undefined) {
            this.validateArea(area);
        }
    }

    // Regla de negocio: Validación y actualización del estado del potrero
    public changeStatus(newStatus: PaddockStatus): void {
        this.status = newStatus;
    }

    // Regla de negocio: Actualización de datos del potrero
    public updateDetails(details: {
        name?: string;
        capacity?: number;
        area?: number | null;
        status?: PaddockStatus;
        description?: string | null;
    }): void {
        if (details.name !== undefined && details.name.trim() === '') {
            throw new Error('Paddock name cannot be empty');
        }
        if (details.capacity !== undefined) {
            this.validateCapacity(details.capacity);
            this.capacity = details.capacity;
        }
        if (details.area !== undefined) {
            if (details.area !== null) {
                this.validateArea(details.area);
            }
            this.area = details.area;
        }
        if (details.name !== undefined) this.name = details.name;
        if (details.status !== undefined) this.status = details.status;
        if (details.description !== undefined) this.description = details.description;
    }

    // Regla de negocio: Comprobación de aforo
    public isCapacityExceeded(currentAnimalCount: number): boolean {
        return currentAnimalCount > this.capacity;
    }

    public canAccommodate(currentAnimalCount: number, incomingCount: number = 1): boolean {
        if (this.status !== PaddockStatus.ACTIVE) {
            return false;
        }
        return (currentAnimalCount + incomingCount) <= this.capacity;
    }

    private validateCapacity(capacity: number): void {
        if (capacity < 0 || !Number.isInteger(capacity)) {
            throw new Error('Paddock capacity must be a positive integer or zero');
        }
    }

    private validateArea(area: number): void {
        if (area < 0) {
            throw new Error('Paddock area cannot be negative');
        }
    }
}
