export type AuditAction = 
    | 'LOGIN'
    | 'LOGOUT'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'ROLE_CHANGE'
    | 'PASSWORD_RESET'
    | 'TRANSFER';

export type AuditStatus = 'SUCCESS' | 'FAILURE';

export interface AuditLogProps {
    id: string;
    userId?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
    action: AuditAction | string;
    resource: string;
    resourceId?: string | null;
    details?: string | null;
    ipAddress?: string | null;
    status?: AuditStatus;
    createdAt?: Date;
}

export class AuditLog {
    public readonly id: string;
    public readonly userId: string | null;
    public readonly userEmail: string | null;
    public readonly userRole: string | null;
    public readonly action: string;
    public readonly resource: string;
    public readonly resourceId: string | null;
    public readonly details: string | null;
    public readonly ipAddress: string | null;
    public readonly status: AuditStatus;
    public readonly createdAt: Date;

    constructor(props: AuditLogProps) {
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
