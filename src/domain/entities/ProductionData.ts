export enum ProductionPurpose {
    MEAT = 'meat',
    MILK = 'milk',
    BREEDING = 'breeding',
    WORK = 'work',
    EGGS = 'eggs',
    WOOL = 'wool',
    DUAL = 'dual',
    OTHER = 'other'
}

export class ProductionData {
    constructor(
        public readonly id: string,
        public animalId: string,
        public weight: number | null,
        public milkProduction: number | null,
        public purpose: ProductionPurpose,
        public recordDate: Date,
        public productionDate: Date | null = null,
        public weightGain: number | null = null,
        public productQuality: string | null = null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
