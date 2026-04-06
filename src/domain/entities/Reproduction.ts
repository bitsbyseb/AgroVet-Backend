export enum ReproductiveStatus {
    EMPTY = 'empty',
    PREGNANT = 'pregnant',
    LACTATING = 'lactating',
    ANESTRUS = 'anestrus'
}

export enum BreedingType {
    NATURAL = 'natural',
    INSEMINATION = 'insemination'
}

export class Reproduction {
    constructor(
        public readonly id: string,
        public animalId: string,
        public reproductiveStatus: ReproductiveStatus,
        public lastCalvingDate: string | null,
        public offspringCount: number,
        public breedingType: BreedingType | null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
