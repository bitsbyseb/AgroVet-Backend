export var weightUnits;
(function (weightUnits) {
    weightUnits["g"] = "g";
    weightUnits["mg"] = "mg";
    weightUnits["kg"] = "kg";
})(weightUnits || (weightUnits = {}));
export var frequency;
(function (frequency) {
    frequency["daily"] = "daily";
    frequency["weekly"] = "weekly";
})(frequency || (frequency = {}));
export class Alimentation {
    id;
    animalId;
    foodId;
    count;
    unit;
    frequency;
    startDate;
    endDate;
    observations;
    createdAt;
    updatedAt;
    constructor(id, animalId, foodId, count, unit, frequency, startDate, endDate, observations, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.foodId = foodId;
        this.count = count;
        this.unit = unit;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.observations = observations;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
