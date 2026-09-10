export class Food {
    id;
    name;
    type;
    description;
    createdAt;
    updatedAt;
    constructor(id, name, type, description, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
