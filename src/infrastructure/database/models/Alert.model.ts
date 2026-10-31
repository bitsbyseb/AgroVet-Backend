import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional
} from '@sequelize/core';
import { Attribute, PrimaryKey, Table, Default, NotNull } from '@sequelize/core/decorators-legacy';
import type { AlertModuleType, AlertStatus, AlertPriority } from '@domain/entities/Alert.js';

@Table({ tableName: 'alerts', underscored: true })
export class Alert extends Model<InferAttributes<Alert>, InferCreationAttributes<Alert>> {
    @Attribute(DataTypes.UUID)
    @PrimaryKey
    @NotNull
    declare id: string;

    /** FK → Animal */
    @Attribute(DataTypes.UUID)
    @NotNull
    declare animalId: string;

    /** FK → User (profesional o administrador responsable) */
    @Attribute(DataTypes.UUID)
    @NotNull
    declare userId: string;

    /**
     * Módulo que originó la alerta.
     * Valores válidos: vaccination | treatment | control | feeding | reproduction | production | grazing
     */
    @Attribute(DataTypes.ENUM(
        'vaccination',
        'treatment',
        'control',
        'feeding',
        'reproduction',
        'production',
        'grazing'
    ))
    @NotNull
    declare moduleType: AlertModuleType;

    /** Texto descriptivo de la alerta que se mostrará al usuario. */
    @Attribute(DataTypes.TEXT)
    @NotNull
    declare message: string;

    /** Fecha y hora en que la alerta debe dispararse / notificarse. */
    @Attribute(DataTypes.DATE)
    @NotNull
    declare triggerDate: Date;

    /**
     * Estado actual de la alerta.
     * pending → No vista / sin gestionar.
     * read    → Vista / gestionada por el usuario.
     */
    @Attribute(DataTypes.ENUM('pending', 'read'))
    @Default('pending')
    @NotNull
    declare status: AlertStatus;

    /**
     * Nivel de prioridad.
     * low | medium | high
     */
    @Attribute(DataTypes.ENUM('low', 'medium', 'high'))
    @Default('medium')
    @NotNull
    declare priority: AlertPriority;

    /** Indica si ya se envió el correo electrónico de notificación. */
    @Attribute(DataTypes.BOOLEAN)
    @Default(false)
    @NotNull
    declare emailSent: boolean;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}
