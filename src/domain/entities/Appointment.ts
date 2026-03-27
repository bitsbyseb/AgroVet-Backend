export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export class Appointment {
    constructor(
        public readonly id: string,
        public animalId: string,
        public date: Date,
        public reason: string,
        public status: AppointmentStatus = AppointmentStatus.SCHEDULED,
        public createdBy: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) {}

    public update(data: { date?: Date; reason?: string; status?: AppointmentStatus }): void {
        if (data.date) this.date = data.date;
        if (data.reason) this.reason = data.reason;
        if (data.status) this.status = data.status;
    }

    public complete(): void {
        this.status = AppointmentStatus.COMPLETED;
    }

    public cancel(): void {
        this.status = AppointmentStatus.CANCELLED;
    }
}
