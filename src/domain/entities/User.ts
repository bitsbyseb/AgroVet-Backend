export enum UserRole {
    ADMIN = 'administrator',
    VETERINARIAN = 'veterinarian',
    ZOOTECHNICIAN = "zootechnician"
}

export interface UserProps {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User {
    private props: UserProps;

    constructor(props: UserProps) {
        this.props = props;
    }

    get id(): string { return this.props.id; }
    get username(): string { return this.props.username; }
    get email(): string { return this.props.email; }
    get password(): string { return this.props.password; }
    get role(): UserRole { return this.props.role; }
    get createdAt(): Date | undefined { return this.props.createdAt; }
    get updatedAt(): Date | undefined { return this.props.updatedAt; }

    toPrimitives() {
        return { ...this.props };
    }
}
