export var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "scheduled";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELLED"] = "cancelled";
})(AppointmentStatus || (AppointmentStatus = {}));
export class Appointment {
    id;
    animalId;
    date;
    reason;
    status;
    createdBy;
    createdAt;
    updatedAt;
    constructor(id, animalId, date, reason, status = AppointmentStatus.SCHEDULED, createdBy, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.date = date;
        this.reason = reason;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    update(data) {
        if (data.date)
            this.date = data.date;
        if (data.reason)
            this.reason = data.reason;
        if (data.status)
            this.status = data.status;
    }
    complete() {
        this.status = AppointmentStatus.COMPLETED;
    }
    cancel() {
        this.status = AppointmentStatus.CANCELLED;
    }
}
