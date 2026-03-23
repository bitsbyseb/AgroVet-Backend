export enum AnimalType {
    URBAN = "urban",
    RURAL = "rural"
}

export enum SpeciesType {
    CANINE = "canine",
    FELINE = "feline",
    BOVINE = "bovine",
    CAPRINE = "caprine",
    EQUINE = "equine",
    POULTRY = "poultry",
    PIG = "pig"
}

export enum Gender {
    MALE = "male",
    FEMALE = "female" 
}

enum Status {
    ACTIVE="active",
    INACTIVE="inactive"
}

export class Animal {
    constructor(
        public readonly id: string,
        public name: string,
        public species: SpeciesType,
        public animalType: AnimalType,
        public breed: string,
        public gender: Gender,
        public birthDate: Date,
        public status:Status = Status.ACTIVE,
        public color: string,
        public ownerId: string, // El ID del dueño actual
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}

    // Regla de negocio: Transferencia de dueño
    public transferTo(newOwnerId: string): void {
        if (!newOwnerId) {
            throw new Error("New owner ID is required for transfer");
        }
        if (this.ownerId === newOwnerId) {
            throw new Error("Animal is already owned by this person");
        }
        this.ownerId = newOwnerId;
    }

    // Regla de negocio: Actualización de datos físicos
    public updatePhysicalData(data: { name?: string; color?: string; breed?: string; status?:Status }): void {
        if (data.name) this.name = data.name;
        if (data.color) this.color = data.color;
        if (data.breed) this.breed = data.breed;
        if (data.status) this.status = data.status;
    }
}
