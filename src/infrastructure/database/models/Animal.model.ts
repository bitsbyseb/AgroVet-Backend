import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from "@sequelize/core";
import {Attribute, PrimaryKey, NotNull, Unique, Table} from '@sequelize/core/decorators-legacy'

enum animalType {
    URBAN = "urban",
    RURAL = "rural"
}

enum speciesType {
    CANINE = "canine",
    FELINE = "feline",
    BOVINE = "bovine",
    CAPRINE = "caprine",
    EQUINE = "equine",
    POULTRY = "poultry", // avicola
    PIG = "pig"
}

enum Gender {
    MALE = "male",
    FEMALE = "female" 
}

@Table({
    tableName:"animals"
})
export class Animal extends Model<InferAttributes<Animal>,InferCreationAttributes<Animal>> {
    @Attribute(DataTypes.UUID)
    @Unique
    @NotNull
    @PrimaryKey
    declare id:string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name:string;

    @Attribute(DataTypes.ENUM(...Object.values(speciesType)))
    @NotNull
    declare species:speciesType;

    @Attribute(DataTypes.ENUM(...Object.values(animalType)))
    @NotNull
    declare animalType:animalType;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare breed:string;

    @Attribute(DataTypes.ENUM(...Object.values(Gender)))
    @NotNull
    declare gender:Gender;

    @Attribute(DataTypes.DATEONLY)
    @NotNull
    declare birthDate:Date;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare color:string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare ownerId:string;
}