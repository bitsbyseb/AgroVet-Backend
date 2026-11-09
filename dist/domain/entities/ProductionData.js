export var ProductionPurpose;
(function (ProductionPurpose) {
    ProductionPurpose["MEAT"] = "meat";
    ProductionPurpose["MILK"] = "milk";
    ProductionPurpose["BREEDING"] = "breeding";
    ProductionPurpose["WORK"] = "work";
    ProductionPurpose["EGGS"] = "eggs";
    ProductionPurpose["WOOL"] = "wool";
    ProductionPurpose["DUAL"] = "dual";
    ProductionPurpose["OTHER"] = "other";
})(ProductionPurpose || (ProductionPurpose = {}));
export class ProductionData {
    id;
    animalId;
    weight;
    milkProduction;
    purpose;
    recordDate;
    productionDate;
    weightGain;
    productQuality;
    createdAt;
    updatedAt;
    constructor(id, animalId, weight, milkProduction, purpose, recordDate, productionDate = null, weightGain = null, productQuality = null, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.weight = weight;
        this.milkProduction = milkProduction;
        this.purpose = purpose;
        this.recordDate = recordDate;
        this.productionDate = productionDate;
        this.weightGain = weightGain;
        this.productQuality = productQuality;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
