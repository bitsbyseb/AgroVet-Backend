export class MedicalHistory {
    constructor(
        public readonly id: string,
        public animalId: string,
        public date: Date,
        public reason: string,
        public diagnosis: string,
        public treatment: string,
        public observations: string,
        public createdBy: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}

    public update(data: { 
        reason?: string; 
        diagnosis?: string; 
        treatment?: string; 
        observations?: string 
    }): void {
        if (data.reason) this.reason = data.reason;
        if (data.diagnosis) this.diagnosis = data.diagnosis;
        if (data.treatment) this.treatment = data.treatment;
        if (data.observations) this.observations = data.observations;
    }
}
