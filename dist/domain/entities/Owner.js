export var OwnerType;
(function (OwnerType) {
    OwnerType["URBAN"] = "urban";
    OwnerType["RURAL"] = "rural";
})(OwnerType || (OwnerType = {}));
export class Owner {
    id;
    name;
    document;
    phone;
    email;
    address;
    ownerType;
    createdAt;
    updatedAt;
    constructor(id, name, document, phone, email, address, ownerType, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.ownerType = ownerType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    updateDetails(details) {
        if (details.name)
            this.name = details.name;
        if (details.phone)
            this.phone = details.phone;
        if (details.email)
            this.email = details.email;
        if (details.address)
            this.address = details.address;
        if (details.ownerType)
            this.ownerType = details.ownerType;
    }
}
