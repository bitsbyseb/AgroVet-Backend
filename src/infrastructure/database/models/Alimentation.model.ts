import { DataTypes, Model } from "@sequelize/core";
import {
    Table,
    PrimaryKey,
    Attribute,
    NotNull
} from "@sequelize/core/decorators-legacy";

import { weightUnits, frequency } from "@domain/entities/Alimentation.js";

@Table({
    tableName: "alimentation",
})
export class Alimentation extends Model {
    @Attribute(DataTypes.UUID)
    @PrimaryKey
    @NotNull
    declare alimentationId: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare animalId: string;

    @Attribute(DataTypes.UUID)
    @NotNull
    declare foodId: string;

    @Attribute(DataTypes.INTEGER)
    declare count: number;

    @Attribute(DataTypes.ENUM(...Object.values(weightUnits)))
    declare unit: weightUnits;

    @Attribute(DataTypes.ENUM(...Object.values(frequency)))
    declare frequency: frequency;

    @Attribute({
        type: DataTypes.DATE,
        columnName: 'start_date'
    })
    declare startDate: Date;

    @Attribute({
        type: DataTypes.DATE,
        columnName: 'end_date'
    })
    declare endDate: Date;

    get start_date(): Date {
        return (this as any).getDataValue ? (this as any).getDataValue('startDate') : this.startDate;
    }

    set start_date(value: Date) {
        if ((this as any).setDataValue) {
            (this as any).setDataValue('startDate', value);
        } else {
            this.startDate = value;
        }
    }

    get end_date(): Date {
        return (this as any).getDataValue ? (this as any).getDataValue('endDate') : this.endDate;
    }

    set end_date(value: Date) {
        if ((this as any).setDataValue) {
            (this as any).setDataValue('endDate', value);
        } else {
            this.endDate = value;
        }
    }

    @Attribute(DataTypes.TEXT)
    declare observations: string;
}