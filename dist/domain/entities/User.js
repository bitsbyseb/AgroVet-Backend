export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "administrator";
    UserRole["VETERINARIAN"] = "veterinarian";
    UserRole["ZOOTECHNICIAN"] = "zootechnician";
})(UserRole || (UserRole = {}));
export class User {
    props;
    constructor(props) {
        this.props = props;
    }
    get id() { return this.props.id; }
    get username() { return this.props.username; }
    get email() { return this.props.email; }
    get password() { return this.props.password; }
    get role() { return this.props.role; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    toPrimitives() {
        return { ...this.props };
    }
}
