export var ProductionPurpose;
(function (ProductionPurpose) {
    ProductionPurpose["MEAT"] = "meat";
    ProductionPurpose["MILK"] = "milk";
    ProductionPurpose["BREEDING"] = "breeding";
    ProductionPurpose["WORK"] = "work";
})(ProductionPurpose || (ProductionPurpose = {}));
export class ProductionData {
    id;
    animalId;
    weight;
    milkProduction;
    purpose;
    recordDate;
    createdAt;
    updatedAt;
    constructor(id, animalId, weight, milkProduction, purpose, recordDate, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.weight = weight;
        this.milkProduction = milkProduction;
        this.purpose = purpose;
        this.recordDate = recordDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
