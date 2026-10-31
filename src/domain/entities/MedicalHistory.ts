export interface PhysiologicalConstants {
    heartRate?: number | null;          // Frecuencia cardíaca (lpm / bpm)
    respiratoryRate?: number | null;    // Frecuencia respiratoria (rpm)
    temperature?: number | null;        // Temperatura corporal (°C)
    capillaryRefillTime?: number | null;// Tiempo de llenado capilar en segundos (TRC)
    mucosalState?: string | null;       // Estado de mucosas (rosadas, pálidas, cianóticas, ictéricas, etc.)
    [key: string]: any;
}

export interface ClinicalMeasurements {
    weight?: number | null;             // Peso corporal en kg
    bodyConditionScore?: number | null; // Puntuación de condición corporal (1-5 o 1-9)
    [key: string]: any;
}

export class MedicalHistory {
    public evolution: string | null;
    public physiologicalConstants: PhysiologicalConstants | null;
    public weight: number | null;
    public bodyConditionScore: number | null;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    constructor(
        public readonly id: string,
        public animalId: string,
        public date: Date,
        public reason: string,
        public diagnosis: string,
        public treatment: string,
        public observations: string,
        public createdBy: string,
        evolutionOrCreatedAt?: string | null | Date,
        physiologicalConstantsOrUpdatedAt?: PhysiologicalConstants | null | Date,
        weight?: number | null,
        bodyConditionScore?: number | null,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        // Soporte retrocompatible si se invocó con firma previa: (...createdBy, createdAt, updatedAt)
        if (evolutionOrCreatedAt instanceof Date) {
            this.evolution = null;
            this.physiologicalConstants = null;
            this.weight = null;
            this.bodyConditionScore = null;
            this.createdAt = evolutionOrCreatedAt;
            this.updatedAt = physiologicalConstantsOrUpdatedAt instanceof Date ? physiologicalConstantsOrUpdatedAt : undefined;
        } else {
            this.evolution = evolutionOrCreatedAt ?? null;
            this.physiologicalConstants = (physiologicalConstantsOrUpdatedAt as PhysiologicalConstants) ?? null;
            this.weight = weight ?? null;
            this.bodyConditionScore = bodyConditionScore ?? null;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }

    // Getters de conveniencia para constantes fisiológicas
    get heartRate(): number | null | undefined {
        return this.physiologicalConstants?.heartRate;
    }

    get respiratoryRate(): number | null | undefined {
        return this.physiologicalConstants?.respiratoryRate;
    }

    get temperature(): number | null | undefined {
        return this.physiologicalConstants?.temperature;
    }

    get capillaryRefillTime(): number | null | undefined {
        return this.physiologicalConstants?.capillaryRefillTime;
    }

    get mucosalState(): string | null | undefined {
        return this.physiologicalConstants?.mucosalState;
    }

    /**
     * Actualiza los datos clínicos del historial médico.
     */
    public update(data: { 
        reason?: string; 
        diagnosis?: string; 
        treatment?: string; 
        observations?: string;
        evolution?: string | null;
        physiologicalConstants?: PhysiologicalConstants | null;
        weight?: number | null;
        bodyConditionScore?: number | null;
        heartRate?: number | null;
        respiratoryRate?: number | null;
        temperature?: number | null;
        capillaryRefillTime?: number | null;
        mucosalState?: string | null;
    }): void {
        if (data.reason !== undefined) this.reason = data.reason;
        if (data.diagnosis !== undefined) this.diagnosis = data.diagnosis;
        if (data.treatment !== undefined) this.treatment = data.treatment;
        if (data.observations !== undefined) this.observations = data.observations;
        if (data.evolution !== undefined) this.evolution = data.evolution;
        if (data.weight !== undefined) this.weight = data.weight;
        if (data.bodyConditionScore !== undefined) this.bodyConditionScore = data.bodyConditionScore;

        if (data.physiologicalConstants !== undefined) {
            this.physiologicalConstants = data.physiologicalConstants;
        }

        // Permitir actualización directa de constantes fisiológicas individuales
        if (
            data.heartRate !== undefined ||
            data.respiratoryRate !== undefined ||
            data.temperature !== undefined ||
            data.capillaryRefillTime !== undefined ||
            data.mucosalState !== undefined
        ) {
            this.physiologicalConstants = {
                ...(this.physiologicalConstants || {}),
                ...(data.heartRate !== undefined ? { heartRate: data.heartRate } : {}),
                ...(data.respiratoryRate !== undefined ? { respiratoryRate: data.respiratoryRate } : {}),
                ...(data.temperature !== undefined ? { temperature: data.temperature } : {}),
                ...(data.capillaryRefillTime !== undefined ? { capillaryRefillTime: data.capillaryRefillTime } : {}),
                ...(data.mucosalState !== undefined ? { mucosalState: data.mucosalState } : {})
            };
        }
    }

    /**
     * Regla de negocio: Registrar o actualizar la evolución clínica del paciente.
     */
    public recordEvolution(evolutionNotes: string): void {
        if (!evolutionNotes || evolutionNotes.trim() === '') {
            throw new Error('Evolution notes cannot be empty');
        }
        this.evolution = evolutionNotes;
    }

    /**
     * Regla de negocio: Actualizar o fusionar constantes fisiológicas.
     */
    public updatePhysiologicalConstants(constants: PhysiologicalConstants): void {
        this.physiologicalConstants = {
            ...(this.physiologicalConstants || {}),
            ...constants
        };
    }

    /**
     * Regla de negocio: Actualizar medidas corporales con validaciones de rangos positivos.
     */
    public updateMeasurements(measurements: { weight?: number | null; bodyConditionScore?: number | null }): void {
        if (measurements.weight !== undefined) {
            if (measurements.weight !== null && measurements.weight <= 0) {
                throw new Error('Weight must be a positive number');
            }
            this.weight = measurements.weight;
        }
        if (measurements.bodyConditionScore !== undefined) {
            if (measurements.bodyConditionScore !== null && measurements.bodyConditionScore <= 0) {
                throw new Error('Body condition score must be a positive number');
            }
            this.bodyConditionScore = measurements.bodyConditionScore;
        }
    }
}
