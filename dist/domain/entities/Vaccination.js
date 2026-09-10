export class Vaccination {
    id;
    animalId;
    vaccineName;
    applicationDate;
    nextDoseDate;
    batchNumber;
    administeredBy;
    createdAt;
    updatedAt;
    constructor(id, animalId, vaccineName, applicationDate, nextDoseDate, batchNumber, administeredBy, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.vaccineName = vaccineName;
        this.applicationDate = applicationDate;
        this.nextDoseDate = nextDoseDate;
        this.batchNumber = batchNumber;
        this.administeredBy = administeredBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    update(data) {
        if (data.vaccineName)
            this.vaccineName = data.vaccineName;
        if (data.applicationDate)
            this.applicationDate = data.applicationDate;
        if (data.nextDoseDate !== undefined)
            this.nextDoseDate = data.nextDoseDate;
        if (data.batchNumber !== undefined)
            this.batchNumber = data.batchNumber;
    }
}
