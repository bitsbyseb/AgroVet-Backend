export enum OwnerType {
    URBAN = "urban",
    RURAL = "rural"
}

export class Owner {
    constructor(
        public readonly id: string,
        public name: string,
        public readonly document: string,
        public phone: string,
        public email: string,
        public address: string,
        public ownerType: OwnerType,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}

    public updateDetails(details: { name?: string; phone?: string; email?: string; address?: string; ownerType?: OwnerType }): void {
        if (details.name) this.name = details.name;
        if (details.phone) this.phone = details.phone;
        if (details.email) this.email = details.email;
        if (details.address) this.address = details.address;
        if (details.ownerType) this.ownerType = details.ownerType;
    }
}
