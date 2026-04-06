export class Food {
    constructor(
        public readonly id: string,
        public name: string,
        public type: string,
        public description: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}
}
