export class MedicalHistory {
    id;
    animalId;
    date;
    reason;
    diagnosis;
    treatment;
    observations;
    createdBy;
    evolution;
    physiologicalConstants;
    weight;
    bodyConditionScore;
    createdAt;
    updatedAt;
    constructor(id, animalId, date, reason, diagnosis, treatment, observations, createdBy, evolutionOrCreatedAt, physiologicalConstantsOrUpdatedAt, weight, bodyConditionScore, createdAt, updatedAt) {
        this.id = id;
        this.animalId = animalId;
        this.date = date;
        this.reason = reason;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.observations = observations;
        this.createdBy = createdBy;
        // Soporte retrocompatible si se invocó con firma previa: (...createdBy, createdAt, updatedAt)
        if (evolutionOrCreatedAt instanceof Date) {
            this.evolution = null;
            this.physiologicalConstants = null;
            this.weight = null;
            this.bodyConditionScore = null;
            this.createdAt = evolutionOrCreatedAt;
            this.updatedAt = physiologicalConstantsOrUpdatedAt instanceof Date ? physiologicalConstantsOrUpdatedAt : undefined;
        }
        else {
            this.evolution = evolutionOrCreatedAt ?? null;
            this.physiologicalConstants = physiologicalConstantsOrUpdatedAt ?? null;
            this.weight = weight ?? null;
            this.bodyConditionScore = bodyConditionScore ?? null;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }
    // Getters de conveniencia para constantes fisiológicas
    get heartRate() {
        return this.physiologicalConstants?.heartRate;
    }
    get respiratoryRate() {
        return this.physiologicalConstants?.respiratoryRate;
    }
    get temperature() {
        return this.physiologicalConstants?.temperature;
    }
    get capillaryRefillTime() {
        return this.physiologicalConstants?.capillaryRefillTime;
    }
    get mucosalState() {
        return this.physiologicalConstants?.mucosalState;
    }
    /**
     * Actualiza los datos clínicos del historial médico.
     */
    update(data) {
        if (data.reason !== undefined)
            this.reason = data.reason;
        if (data.diagnosis !== undefined)
            this.diagnosis = data.diagnosis;
        if (data.treatment !== undefined)
            this.treatment = data.treatment;
        if (data.observations !== undefined)
            this.observations = data.observations;
        if (data.evolution !== undefined)
            this.evolution = data.evolution;
        if (data.weight !== undefined)
            this.weight = data.weight;
        if (data.bodyConditionScore !== undefined)
            this.bodyConditionScore = data.bodyConditionScore;
        if (data.physiologicalConstants !== undefined) {
            this.physiologicalConstants = data.physiologicalConstants;
        }
        // Permitir actualización directa de constantes fisiológicas individuales
        if (data.heartRate !== undefined ||
            data.respiratoryRate !== undefined ||
            data.temperature !== undefined ||
            data.capillaryRefillTime !== undefined ||
            data.mucosalState !== undefined) {
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
    recordEvolution(evolutionNotes) {
        if (!evolutionNotes || evolutionNotes.trim() === '') {
            throw new Error('Evolution notes cannot be empty');
        }
        this.evolution = evolutionNotes;
    }
    /**
     * Regla de negocio: Actualizar o fusionar constantes fisiológicas.
     */
    updatePhysiologicalConstants(constants) {
        this.physiologicalConstants = {
            ...(this.physiologicalConstants || {}),
            ...constants
        };
    }
    /**
     * Regla de negocio: Actualizar medidas corporales con validaciones de rangos positivos.
     */
    updateMeasurements(measurements) {
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
