export enum weightUnits {
    g = "g",
    mg = "mg",
    kg = "kg"
}

export enum frequency {
    daily = "daily",
    weekly = "weekly"
}

export class Alimentation {
    constructor(
        public readonly id: string,
        public animalId: string,
        public foodId: string,
        public count: number,
        public unit: weightUnits,
        public frequency: frequency,
        public startDate: Date,
        public endDate: Date,
        public observations: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
