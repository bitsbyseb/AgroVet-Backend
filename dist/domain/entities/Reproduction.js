export var ReproductiveStatus;
(function (ReproductiveStatus) {
    ReproductiveStatus["EMPTY"] = "empty";
    ReproductiveStatus["PREGNANT"] = "pregnant";
    ReproductiveStatus["LACTATING"] = "lactating";
    ReproductiveStatus["ANESTRUS"] = "anestrus";
})(ReproductiveStatus || (ReproductiveStatus = {}));
export var BreedingType;
(function (BreedingType) {
    BreedingType["NATURAL"] = "natural";
    BreedingType["INSEMINATION"] = "insemination";
})(BreedingType || (BreedingType = {}));
export class Reproduction {
    id;
    animalId;
    reproductiveStatus;
    lastCalvingDate;
    offspringCount;
    breedingType;
    createdAt;
    updatedAt;
    constructor(id, animalId, reproductiveStatus, lastCalvingDate, offspringCount, breedingType, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.reproductiveStatus = reproductiveStatus;
        this.lastCalvingDate = lastCalvingDate;
        this.offspringCount = offspringCount;
        this.breedingType = breedingType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
