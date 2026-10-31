import { describe, it, expect } from 'vitest';
import { MedicalHistory, type PhysiologicalConstants } from '@domain/entities/MedicalHistory.js';
import { randomUUID } from 'node:crypto';

describe('Entidad de Dominio: MedicalHistory', () => {
    const animalId = randomUUID();
    const createdBy = randomUUID();

    it('debería instanciar un historial médico con todos los campos clínicos ampliados (HU8)', () => {
        const id = randomUUID();
        const date = new Date('2026-10-20T10:00:00Z');
        const constants: PhysiologicalConstants = {
            heartRate: 110,
            respiratoryRate: 28,
            temperature: 38.8,
            capillaryRefillTime: 1.5,
            mucosalState: 'rosadas'
        };

        const history = new MedicalHistory(
            id,
            animalId,
            date,
            'Control postoperatorio',
            'Herida en cicatrización adecuada',
            'Cefalexina 500mg c/12h',
            'Paciente animado',
            createdBy,
            'Evolución favorable, sin signos de infección',
            constants,
            24.5,
            3.5
        );

        expect(history.id).toBe(id);
        expect(history.animalId).toBe(animalId);
        expect(history.date).toBe(date);
        expect(history.reason).toBe('Control postoperatorio');
        expect(history.diagnosis).toBe('Herida en cicatrización adecuada');
        expect(history.treatment).toBe('Cefalexina 500mg c/12h');
        expect(history.observations).toBe('Paciente animado');
        expect(history.createdBy).toBe(createdBy);
        expect(history.evolution).toBe('Evolución favorable, sin signos de infección');
        expect(history.weight).toBe(24.5);
        expect(history.bodyConditionScore).toBe(3.5);
        expect(history.physiologicalConstants).toEqual(constants);

        // Getters de conveniencia
        expect(history.heartRate).toBe(110);
        expect(history.respiratoryRate).toBe(28);
        expect(history.temperature).toBe(38.8);
        expect(history.capillaryRefillTime).toBe(1.5);
        expect(history.mucosalState).toBe('rosadas');
    });

    it('debería mantener retrocompatibilidad cuando se omiten los nuevos campos clínicos opcionales', () => {
        const id = randomUUID();
        const date = new Date('2026-10-20');

        const history = new MedicalHistory(
            id,
            animalId,
            date,
            'Consulta general',
            'Sano',
            'Desparasitación',
            'Sin observaciones',
            createdBy
        );

        expect(history.id).toBe(id);
        expect(history.evolution).toBeNull();
        expect(history.physiologicalConstants).toBeNull();
        expect(history.weight).toBeNull();
        expect(history.bodyConditionScore).toBeNull();
        expect(history.heartRate).toBeUndefined();
        expect(history.temperature).toBeUndefined();
    });

    it('debería mantener retrocompatibilidad cuando el noveno argumento es createdAt (Date)', () => {
        const id = randomUUID();
        const date = new Date('2026-03-15');
        const createdAt = new Date('2026-03-15T12:00:00Z');
        const updatedAt = new Date('2026-03-15T12:30:00Z');

        const history = new MedicalHistory(
            id,
            animalId,
            date,
            'R',
            'D',
            'T',
            'O',
            createdBy,
            createdAt,
            updatedAt
        );

        expect(history.createdAt).toBe(createdAt);
        expect(history.updatedAt).toBe(updatedAt);
        expect(history.evolution).toBeNull();
        expect(history.physiologicalConstants).toBeNull();
        expect(history.weight).toBeNull();
        expect(history.bodyConditionScore).toBeNull();
    });

    it('debería actualizar campos médicos mediante el método update', () => {
        const history = new MedicalHistory(
            randomUUID(),
            animalId,
            new Date(),
            'R',
            'D',
            'T',
            'O',
            createdBy
        );

        history.update({
            diagnosis: 'Diagnóstico nuevo',
            evolution: 'Mejora progresiva tras 24h',
            weight: 30.2,
            bodyConditionScore: 4,
            temperature: 39.1,
            heartRate: 125
        });

        expect(history.diagnosis).toBe('Diagnóstico nuevo');
        expect(history.evolution).toBe('Mejora progresiva tras 24h');
        expect(history.weight).toBe(30.2);
        expect(history.bodyConditionScore).toBe(4);
        expect(history.temperature).toBe(39.1);
        expect(history.heartRate).toBe(125);
    });

    it('debería permitir registrar evolución con validación de campo no vacío', () => {
        const history = new MedicalHistory(
            randomUUID(),
            animalId,
            new Date(),
            'R',
            'D',
            'T',
            'O',
            createdBy
        );

        history.recordEvolution('Evolución estable durante el turno diurno');
        expect(history.evolution).toBe('Evolución estable durante el turno diurno');

        expect(() => history.recordEvolution('')).toThrow('Evolution notes cannot be empty');
        expect(() => history.recordEvolution('   ')).toThrow('Evolution notes cannot be empty');
    });

    it('debería actualizar medidas corporales validando que el peso y condición corporal sean positivos', () => {
        const history = new MedicalHistory(
            randomUUID(),
            animalId,
            new Date(),
            'R',
            'D',
            'T',
            'O',
            createdBy
        );

        history.updateMeasurements({ weight: 18.5, bodyConditionScore: 3 });
        expect(history.weight).toBe(18.5);
        expect(history.bodyConditionScore).toBe(3);

        expect(() => history.updateMeasurements({ weight: -5 })).toThrow('Weight must be a positive number');
        expect(() => history.updateMeasurements({ weight: 0 })).toThrow('Weight must be a positive number');
        expect(() => history.updateMeasurements({ bodyConditionScore: -1 })).toThrow('Body condition score must be a positive number');
    });

    it('debería actualizar constantes fisiológicas de manera acumulativa/incremental', () => {
        const history = new MedicalHistory(
            randomUUID(),
            animalId,
            new Date(),
            'R',
            'D',
            'T',
            'O',
            createdBy
        );

        history.updatePhysiologicalConstants({ temperature: 38.7, heartRate: 95 });
        expect(history.temperature).toBe(38.7);
        expect(history.heartRate).toBe(95);

        history.updatePhysiologicalConstants({ respiratoryRate: 22, capillaryRefillTime: 2 });
        expect(history.temperature).toBe(38.7); // se mantiene
        expect(history.heartRate).toBe(95);      // se mantiene
        expect(history.respiratoryRate).toBe(22);
        expect(history.capillaryRefillTime).toBe(2);
    });
});
