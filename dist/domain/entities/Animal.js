export var animalType;
(function (animalType) {
    animalType["URBAN"] = "urban";
    animalType["RURAL"] = "rural";
})(animalType || (animalType = {}));
export var speciesType;
(function (speciesType) {
    speciesType["CANINE"] = "canine";
    speciesType["FELINE"] = "feline";
    speciesType["BOVINE"] = "bovine";
    speciesType["CAPRINE"] = "caprine";
    speciesType["EQUINE"] = "equine";
    speciesType["POULTRY"] = "poultry";
    speciesType["PIG"] = "pig";
})(speciesType || (speciesType = {}));
export var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (Gender = {}));
export var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["INACTIVE"] = "inactive";
})(Status || (Status = {}));
export class Animal {
    id;
    name;
    species;
    animalType;
    breed;
    gender;
    birthDate;
    status;
    color;
    ownerId;
    paddockId;
    createdAt;
    updatedAt;
    constructor(id, name, species, animalType, breed, gender, birthDate, status = Status.ACTIVE, color, ownerId, // El ID del dueño actual
    paddockId, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.animalType = animalType;
        this.breed = breed;
        this.gender = gender;
        this.birthDate = birthDate;
        this.status = status;
        this.color = color;
        this.ownerId = ownerId;
        this.paddockId = paddockId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // Regla de negocio: Transferencia de dueño
    transferTo(newOwnerId) {
        if (!newOwnerId) {
            throw new Error("New owner ID is required for transfer");
        }
        if (this.ownerId === newOwnerId) {
            throw new Error("Animal is already owned by this person");
        }
        this.ownerId = newOwnerId;
    }
    // Regla de negocio: Actualización de datos físicos
    updatePhysicalData(data) {
        if (data.name)
            this.name = data.name;
        if (data.color)
            this.color = data.color;
        if (data.breed)
            this.breed = data.breed;
        if (data.status)
            this.status = data.status;
        if (data.paddockId !== undefined)
            this.paddockId = data.paddockId;
    }
}
