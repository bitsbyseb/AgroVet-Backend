export var PaddockStatus;
(function (PaddockStatus) {
    PaddockStatus["ACTIVE"] = "ACTIVE";
    PaddockStatus["RESTING"] = "RESTING";
    PaddockStatus["MAINTENANCE"] = "MAINTENANCE";
})(PaddockStatus || (PaddockStatus = {}));
export class Paddock {
    id;
    name;
    capacity;
    area;
    status;
    description;
    createdAt;
    updatedAt;
    constructor(id, name, capacity, area = null, status = PaddockStatus.ACTIVE, description = null, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.area = area;
        this.status = status;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validateCapacity(capacity);
        if (area !== null && area !== undefined) {
            this.validateArea(area);
        }
    }
    // Regla de negocio: Validación y actualización del estado del potrero
    changeStatus(newStatus) {
        this.status = newStatus;
    }
    // Regla de negocio: Actualización de datos del potrero
    updateDetails(details) {
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
        if (details.name !== undefined)
            this.name = details.name;
        if (details.status !== undefined)
            this.status = details.status;
        if (details.description !== undefined)
            this.description = details.description;
    }
    // Regla de negocio: Comprobación de aforo
    isCapacityExceeded(currentAnimalCount) {
        return currentAnimalCount > this.capacity;
    }
    canAccommodate(currentAnimalCount, incomingCount = 1) {
        if (this.status !== PaddockStatus.ACTIVE) {
            return false;
        }
        return (currentAnimalCount + incomingCount) <= this.capacity;
    }
    validateCapacity(capacity) {
        if (capacity < 0 || !Number.isInteger(capacity)) {
            throw new Error('Paddock capacity must be a positive integer or zero');
        }
    }
    validateArea(area) {
        if (area < 0) {
            throw new Error('Paddock area cannot be negative');
        }
    }
}
