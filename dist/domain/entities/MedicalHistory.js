export class MedicalHistory {
    id;
    animalId;
    date;
    reason;
    diagnosis;
    treatment;
    observations;
    createdBy;
    createdAt;
    updatedAt;
    constructor(id, animalId, date, reason, diagnosis, treatment, observations, createdBy, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.date = date;
        this.reason = reason;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.observations = observations;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    update(data) {
        if (data.reason)
            this.reason = data.reason;
        if (data.diagnosis)
            this.diagnosis = data.diagnosis;
        if (data.treatment)
            this.treatment = data.treatment;
        if (data.observations)
            this.observations = data.observations;
    }
}
