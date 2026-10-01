import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "@sequelize/core";
import { Attribute, NotNull, PrimaryKey, Unique } from "@sequelize/core/decorators-legacy";

enum OwnerType {
    URBAN = "urban",
    RURAL = "rural"
}

export class Owner extends Model<InferAttributes<Owner>, InferCreationAttributes<Owner>> {
    @Attribute(DataTypes.UUID)
    @NotNull
    @Unique
    @PrimaryKey
    declare id: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare document: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare phone: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    @Unique
    declare email: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare address: string;

    @Attribute(DataTypes.ENUM(...Object.values(OwnerType)))
    @NotNull
    declare ownerType: OwnerType;

    /**
     * FK nullable hacia `users.id`.
     * Permite vincular este propietario con una cuenta de usuario autenticado (rol OWNER).
     * La asociación User hasOne Owner / Owner belongsTo User se declara en models/index.ts.
     */
    @Attribute(DataTypes.UUID)
    declare userId: CreationOptional<string | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}