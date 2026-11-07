export enum ReproductiveStatus {
    EMPTY = 'empty',
    PREGNANT = 'pregnant',
    LACTATING = 'lactating',
    ANESTRUS = 'anestrus',
    OPEN = 'open',
    DRY = 'dry'
}

export enum BreedingType {
    NATURAL = 'natural',
    INSEMINATION = 'insemination',
    ARTIFICIAL = 'artificial',
    EMBRYO_TRANSFER = 'embryo_transfer'
}

export interface InseminationInfo {
    bullId?: string | null;
    semenBatch?: string | null;
    inseminationDetails?: string | null;
    inseminationDate?: Date | null;
}

export class Reproduction {
    constructor(
        public readonly id: string,
        public animalId: string,
        public reproductiveStatus: ReproductiveStatus,
        public lastCalvingDate: string | null = null,
        public offspringCount: number = 0,
        public breedingType: BreedingType | null = null,
        public heatDate: Date | null = null,
        public expectedCalvingDate: Date | null = null,
        public bullId: string | null = null,
        public semenBatch: string | null = null,
        public inseminationDetails: string | null = null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {
        if (this.offspringCount < 0) {
            throw new Error('Offspring count cannot be negative');
        }
    }

    /**
     * Calcula y asigna la fecha probable de parto a partir de la fecha de celo o servicio,
     * considerando el período medio de gestación de la especie (por defecto 283 días para bovinos).
     */
    public calculateExpectedCalvingDate(baseDate?: Date | null, gestationDays: number = 283): Date | null {
        const reference = baseDate ?? this.heatDate;
        if (!reference) return null;

        const calculated = new Date(reference.getTime() + gestationDays * 24 * 60 * 60 * 1000);
        this.expectedCalvingDate = calculated;
        return calculated;
    }

    /**
     * Registra un celo detectado para el animal.
     */
    public recordHeat(heatDate: Date): void {
        this.heatDate = heatDate;
    }

    /**
     * Registra el evento de monta o inseminación con sus detalles y calcula opcionalmente el parto.
     */
    public recordBreeding(
        type: BreedingType,
        details?: {
            bullId?: string | null;
            semenBatch?: string | null;
            inseminationDetails?: string | null;
            heatDate?: Date | null;
            gestationDays?: number;
        }
    ): void {
        this.breedingType = type;
        if (details?.bullId !== undefined) this.bullId = details.bullId;
        if (details?.semenBatch !== undefined) this.semenBatch = details.semenBatch;
        if (details?.inseminationDetails !== undefined) this.inseminationDetails = details.inseminationDetails;
        if (details?.heatDate) {
            this.heatDate = details.heatDate;
        }

        if (this.heatDate) {
            this.calculateExpectedCalvingDate(this.heatDate, details?.gestationDays ?? 283);
        }
    }

    /**
     * Actualiza atributos del registro reproductivo asegurando invariantes de negocio.
     */
    public update(data: {
        reproductiveStatus?: ReproductiveStatus;
        lastCalvingDate?: string | null;
        offspringCount?: number;
        breedingType?: BreedingType | null;
        heatDate?: Date | null;
        expectedCalvingDate?: Date | null;
        bullId?: string | null;
        semenBatch?: string | null;
        inseminationDetails?: string | null;
    }): void {
        if (data.offspringCount !== undefined) {
            if (data.offspringCount < 0) {
                throw new Error('Offspring count cannot be negative');
            }
            this.offspringCount = data.offspringCount;
        }
        if (data.reproductiveStatus !== undefined) this.reproductiveStatus = data.reproductiveStatus;
        if (data.lastCalvingDate !== undefined) this.lastCalvingDate = data.lastCalvingDate;
        if (data.breedingType !== undefined) this.breedingType = data.breedingType;
        if (data.heatDate !== undefined) this.heatDate = data.heatDate;
        if (data.expectedCalvingDate !== undefined) this.expectedCalvingDate = data.expectedCalvingDate;
        if (data.bullId !== undefined) this.bullId = data.bullId;
        if (data.semenBatch !== undefined) this.semenBatch = data.semenBatch;
        if (data.inseminationDetails !== undefined) this.inseminationDetails = data.inseminationDetails;
    }
}
