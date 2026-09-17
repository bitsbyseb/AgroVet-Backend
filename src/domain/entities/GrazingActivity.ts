export class GrazingActivity {
    constructor(
        public readonly id: string,
        public paddockId: string,
        public animalIds: string[] = [],
        public entryDate: Date,
        public exitDate: Date | null = null,
        public rotationNumber: number = 1,
        public observations: string | null = null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        this.validatePaddockId(paddockId);
        this.validateRotationNumber(rotationNumber);
        this.validateDates(entryDate, exitDate);
        this.validateAnimalIds(animalIds);
    }

    // Regla de negocio: Registrar salida de los animales del potrero
    public recordExit(exitDate: Date, observations?: string | null): void {
        this.validateDates(this.entryDate, exitDate);
        this.exitDate = exitDate;
        if (observations !== undefined) {
            this.observations = observations;
        }
    }

    // Regla de negocio: Determinar si la actividad de pastoreo está activa
    public isActive(): boolean {
        return this.exitDate === null || this.exitDate === undefined;
    }

    // Regla de negocio: Determinar si la rotación ha finalizado
    public isCompleted(): boolean {
        return this.exitDate !== null && this.exitDate !== undefined;
    }

    // Regla de negocio: Agregar un animal al lote de pastoreo
    public addAnimal(animalId: string): void {
        if (!animalId || animalId.trim() === '') {
            throw new Error('Animal ID cannot be empty');
        }
        if (!this.animalIds.includes(animalId)) {
            this.animalIds.push(animalId);
        }
    }

    // Regla de negocio: Remover un animal del lote de pastoreo
    public removeAnimal(animalId: string): void {
        this.animalIds = this.animalIds.filter(id => id !== animalId);
    }

    // Regla de negocio: Conteo de animales en el lote
    public getAnimalCount(): number {
        return this.animalIds.length;
    }

    // Regla de negocio: Cálculo de días de ocupación / permanencia
    public getDurationInDays(): number {
        const end = this.exitDate ? this.exitDate.getTime() : Date.now();
        const start = this.entryDate.getTime();
        const diffTime = end - start;
        return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    }

    // Regla de negocio: Actualización de detalles de la actividad
    public updateDetails(details: {
        entryDate?: Date;
        exitDate?: Date | null;
        rotationNumber?: number;
        observations?: string | null;
    }): void {
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

    private validatePaddockId(paddockId: string): void {
        if (!paddockId || paddockId.trim() === '') {
            throw new Error('Paddock ID cannot be empty');
        }
    }

    private validateRotationNumber(rotationNumber: number): void {
        if (!Number.isInteger(rotationNumber) || rotationNumber < 1) {
            throw new Error('Rotation number must be a positive integer greater than or equal to 1');
        }
    }

    private validateDates(entryDate: Date, exitDate: Date | null): void {
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

    private validateAnimalIds(animalIds: string[]): void {
        if (!Array.isArray(animalIds)) {
            throw new Error('Animal IDs must be an array');
        }
    }
}
