export class GrazingActivity {
    id;
    paddockId;
    animalIds;
    entryDate;
    exitDate;
    rotationNumber;
    observations;
    createdAt;
    updatedAt;
    constructor(id, paddockId, animalIds = [], entryDate, exitDate = null, rotationNumber = 1, observations = null, createdAt, updatedAt) {
        this.id = id;
        this.paddockId = paddockId;
        this.animalIds = animalIds;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
        this.rotationNumber = rotationNumber;
        this.observations = observations;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validatePaddockId(paddockId);
        this.validateRotationNumber(rotationNumber);
        this.validateDates(entryDate, exitDate);
        this.validateAnimalIds(animalIds);
    }
    // Regla de negocio: Registrar salida de los animales del potrero
    recordExit(exitDate, observations) {
        this.validateDates(this.entryDate, exitDate);
        this.exitDate = exitDate;
        if (observations !== undefined) {
            this.observations = observations;
        }
    }
    // Regla de negocio: Determinar si la actividad de pastoreo está activa
    isActive() {
        return this.exitDate === null || this.exitDate === undefined;
    }
    // Regla de negocio: Determinar si la rotación ha finalizado
    isCompleted() {
        return this.exitDate !== null && this.exitDate !== undefined;
    }
    // Regla de negocio: Agregar un animal al lote de pastoreo
    addAnimal(animalId) {
        if (!animalId || animalId.trim() === '') {
            throw new Error('Animal ID cannot be empty');
        }
        if (!this.animalIds.includes(animalId)) {
            this.animalIds.push(animalId);
        }
    }
    // Regla de negocio: Remover un animal del lote de pastoreo
    removeAnimal(animalId) {
        this.animalIds = this.animalIds.filter(id => id !== animalId);
    }
    // Regla de negocio: Conteo de animales en el lote
    getAnimalCount() {
        return this.animalIds.length;
    }
    // Regla de negocio: Cálculo de días de ocupación / permanencia
    getDurationInDays() {
        const end = this.exitDate ? this.exitDate.getTime() : Date.now();
        const start = this.entryDate.getTime();
        const diffTime = end - start;
        return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    }
    // Regla de negocio: Actualización de detalles de la actividad
    updateDetails(details) {
        const newEntry = details.entryDate ?? this.entryDate;
        const newExit = details.exitDate !== undefined ? details.exitDate : this.exitDate;
        this.validateDates(newEntry, newExit);
        if (details.rotationNumber !== undefined) {
            this.validateRotationNumber(details.rotationNumber);
            this.rotationNumber = details.rotationNumber;
        }
        if (details.entryDate !== undefined) {
            this.entryDate = details.entryDate;
        }
        if (details.exitDate !== undefined) {
            this.exitDate = details.exitDate;
        }
        if (details.observations !== undefined) {
            this.observations = details.observations;
        }
    }
    validatePaddockId(paddockId) {
        if (!paddockId || paddockId.trim() === '') {
            throw new Error('Paddock ID cannot be empty');
        }
    }
    validateRotationNumber(rotationNumber) {
        if (!Number.isInteger(rotationNumber) || rotationNumber < 1) {
            throw new Error('Rotation number must be a positive integer greater than or equal to 1');
        }
    }
    validateDates(entryDate, exitDate) {
        if (!entryDate || isNaN(entryDate.getTime())) {
            throw new Error('Entry date must be a valid date');
        }
        if (exitDate !== null && exitDate !== undefined) {
            if (isNaN(exitDate.getTime())) {
                throw new Error('Exit date must be a valid date');
            }
            if (exitDate.getTime() < entryDate.getTime()) {
                throw new Error('Exit date cannot be earlier than entry date');
            }
        }
    }
    validateAnimalIds(animalIds) {
        if (!Array.isArray(animalIds)) {
            throw new Error('Animal IDs must be an array');
        }
    }
}
