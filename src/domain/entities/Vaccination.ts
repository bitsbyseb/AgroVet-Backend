export class Vaccination {
    constructor(
        public readonly id: string,
        public animalId: string,
        public vaccineName: string,
        public applicationDate: Date,
        public nextDoseDate: Date | null,
        public batchNumber: string | null,
        public administeredBy: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}

    public update(data: { 
        vaccineName?: string; 
        applicationDate?: Date; 
        nextDoseDate?: Date | null; 
        batchNumber?: string | null 
    }): void {
        if (data.vaccineName) this.vaccineName = data.vaccineName;
        if (data.applicationDate) this.applicationDate = data.applicationDate;
        if (data.nextDoseDate !== undefined) this.nextDoseDate = data.nextDoseDate;
        if (data.batchNumber !== undefined) this.batchNumber = data.batchNumber;
    }
}
