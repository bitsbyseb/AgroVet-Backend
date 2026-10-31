import { describe, it, expect } from 'vitest';
import { SequelizeMedicalHistoryRepository } from '@infrastructure/database/repositories/SequelizeMedicalHistoryRepository.js';
import { MedicalHistory, type PhysiologicalConstants } from '@domain/entities/MedicalHistory.js';
import { randomUUID } from 'node:crypto';

describe('SequelizeMedicalHistoryRepository - Mappers Unit Test', () => {
    const repository = new SequelizeMedicalHistoryRepository();
    const animalId = randomUUID();
    const createdBy = randomUUID();

    describe('toPersistence', () => {
        it('debería transformar una entidad de dominio a un objeto de persistencia Sequelize con campos ampliados', () => {
            const id = randomUUID();
            const date = new Date('2026-10-20T10:00:00Z');
            const constants: PhysiologicalConstants = {
                heartRate: 100,
                respiratoryRate: 25,
                temperature: 38.5,
                capillaryRefillTime: 1.5,
                mucosalState: 'rosadas'
            };

            const entity = new MedicalHistory(
                id,
                animalId,
                date,
                'Consulta de control',
                'Recuperación satisfactoria',
                'Antiinflamatorio',
                'Comportamiento normal',
                createdBy,
                'Evolución positiva sin fiebre',
                constants,
                32.5,
                3.5
            );

            const persistence = repository.toPersistence(entity);

            expect(persistence).toEqual({
                id,
                animalId,
                date,
                reason: 'Consulta de control',
                diagnosis: 'Recuperación satisfactoria',
                treatment: 'Antiinflamatorio',
                observations: 'Comportamiento normal',
                createdBy,
                evolution: 'Evolución positiva sin fiebre',
                physiologicalConstants: constants,
                weight: 32.5,
                bodyConditionScore: 3.5
            });
        });

        it('debería mapear campos opcionales nulos/indefinidos a null para Sequelize', () => {
            const id = randomUUID();
            const date = new Date('2026-10-20');

            const entity = new MedicalHistory(
                id,
                animalId,
                date,
                'Vacunación y chequeo',
                'Sano',
                'Vacuna antirrábica',
                'Ninguna',
                createdBy
            );

            const persistence = repository.toPersistence(entity);

            expect(persistence.evolution).toBeNull();
            expect(persistence.physiologicalConstants).toBeNull();
            expect(persistence.weight).toBeNull();
            expect(persistence.bodyConditionScore).toBeNull();
        });
    });

    describe('toDomain', () => {
        it('debería transformar un modelo Sequelize con datos completos a entidad MedicalHistory', () => {
            const id = randomUUID();
            const date = new Date('2026-10-20');
            const createdAt = new Date('2026-10-20T08:00:00Z');
            const updatedAt = new Date('2026-10-20T09:00:00Z');
            const constants: PhysiologicalConstants = {
                heartRate: 85,
                temperature: 38.2
            };

            const mockModel: any = {
                id,
                animalId,
                date,
                reason: 'Revisión periódica',
                diagnosis: 'Buen estado general',
                treatment: 'Suplemento nutricional',
                observations: 'Alimentación adecuada',
                createdBy,
                evolution: 'Paciente activo y alerta',
                physiologicalConstants: constants,
                weight: '45.80', // Como suele retornar DECIMAL MySQL
                bodyConditionScore: '4.0',
                createdAt,
                updatedAt
            };

            const domain = repository.toDomain(mockModel);

            expect(domain.id).toBe(id);
            expect(domain.animalId).toBe(animalId);
            expect(domain.evolution).toBe('Paciente activo y alerta');
            expect(domain.physiologicalConstants).toEqual(constants);
            expect(domain.weight).toBe(45.8);
            expect(domain.bodyConditionScore).toBe(4);
            expect(domain.heartRate).toBe(85);
            expect(domain.temperature).toBe(38.2);
            expect(domain.createdAt).toBe(createdAt);
            expect(domain.updatedAt).toBe(updatedAt);
        });

        it('debería deserializar physiologicalConstants si viene serializado como string JSON', () => {
            const mockModel: any = {
                id: randomUUID(),
                animalId,
                date: new Date(),
                reason: 'R',
                diagnosis: 'D',
                treatment: 'T',
                observations: 'O',
                createdBy,
                evolution: null,
                physiologicalConstants: JSON.stringify({ heartRate: 90, temperature: 39.0 }),
                weight: null,
                bodyConditionScore: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const domain = repository.toDomain(mockModel);
            expect(domain.physiologicalConstants).toEqual({ heartRate: 90, temperature: 39.0 });
            expect(domain.heartRate).toBe(90);
            expect(domain.temperature).toBe(39.0);
        });
    });
});
