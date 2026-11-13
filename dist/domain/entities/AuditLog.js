export class AuditLog {
    id;
    userId;
    userEmail;
    userRole;
    action;
    resource;
    resourceId;
    details;
    ipAddress;
    status;
    createdAt;
    constructor(props) {
        this.id = props.id;
        this.userId = props.userId ?? null;
        this.userEmail = props.userEmail ?? null;
        this.userRole = props.userRole ?? null;
        this.action = props.action;
        this.resource = props.resource;
        this.resourceId = props.resourceId ?? null;
        this.details = props.details ?? null;
        this.ipAddress = props.ipAddress ?? null;
        this.status = props.status ?? 'SUCCESS';
        this.createdAt = props.createdAt ?? new Date();
    }
}
