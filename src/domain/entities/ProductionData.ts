export enum ProductionPurpose {
    MEAT = 'meat',
    MILK = 'milk',
    BREEDING = 'breeding',
    WORK = 'work'
}

export class ProductionData {
    constructor(
        public readonly id: string,
        public animalId: string,
        public weight: number | null,
        public milkProduction: number | null,
        public purpose: ProductionPurpose,
        public recordDate: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
