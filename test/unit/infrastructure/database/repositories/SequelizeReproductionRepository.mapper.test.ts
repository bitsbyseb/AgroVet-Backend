import { describe, it, expect } from 'vitest';
import { SequelizeReproductionRepository } from '@infrastructure/database/repositories/SequelizeReproductionRepository.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { randomUUID } from 'node:crypto';

describe('SequelizeReproductionRepository - Mappers Unit Test', () => {
    const repository = new SequelizeReproductionRepository();
    const animalId = randomUUID();

    describe('toPersistence', () => {
        it('debería transformar una entidad Reproduction a un objeto de persistencia con los nuevos campos', () => {
            const id = randomUUID();
            const heatDate = new Date('2026-05-10T08:30:00Z');
            const expectedCalvingDate = new Date('2027-02-17T08:30:00Z');

            const entity = new Reproduction(
                id,
                animalId,
                ReproductiveStatus.PREGNANT,
                '2025-04-10',
                2,
                BreedingType.INSEMINATION,
                heatDate,
                expectedCalvingDate,
                'TORO-098',
                'SEMEN-LOTE-2026',
                'Inseminación con catéter recto-vaginal satisfactoria'
            );

            const persistence = repository.toPersistence(entity);

            expect(persistence).toEqual({
                id,
                animalId,
                reproductiveStatus: ReproductiveStatus.PREGNANT,
                lastCalvingDate: '2025-04-10',
                offspringCount: 2,
                breedingType: BreedingType.INSEMINATION,
                heatDate,
                expectedCalvingDate,
                bullId: 'TORO-098',
                semenBatch: 'SEMEN-LOTE-2026',
                inseminationDetails: 'Inseminación con catéter recto-vaginal satisfactoria'
            });
        });

        it('debería transformar valores indefinidos/nulos a null para Sequelize', () => {
            const id = randomUUID();
            const entity = new Reproduction(
                id,
                animalId,
                ReproductiveStatus.EMPTY
            );

            const persistence = repository.toPersistence(entity);

            expect(persistence.lastCalvingDate).toBeNull();
            expect(persistence.breedingType).toBeNull();
            expect(persistence.heatDate).toBeNull();
            expect(persistence.expectedCalvingDate).toBeNull();
            expect(persistence.bullId).toBeNull();
            expect(persistence.semenBatch).toBeNull();
            expect(persistence.inseminationDetails).toBeNull();
            expect(persistence.offspringCount).toBe(0);
        });
    });

    describe('toDomain', () => {
        it('debería transformar un modelo de Sequelize a entidad de Dominio Reproduction con campos completos', () => {
            const id = randomUUID();
            const heatDate = new Date('2026-06-01T10:00:00Z');
            const expectedCalvingDate = new Date('2027-03-11T10:00:00Z');
            const createdAt = new Date('2026-06-01T10:05:00Z');
            const updatedAt = new Date('2026-06-01T10:05:00Z');

            const mockModel: any = {
                id,
                animalId,
                reproductiveStatus: ReproductiveStatus.PREGNANT,
                lastCalvingDate: '2025-05-15',
                offspringCount: 3,
                breedingType: BreedingType.ARTIFICIAL,
                heatDate,
                expectedCalvingDate,
                bullId: 'CHAMPION-BULL-01',
                semenBatch: 'BATCH-2026-B',
                inseminationDetails: 'Protocolo IATF completado',
                createdAt,
                updatedAt
            };

            const domain = repository.toDomain(mockModel);

            expect(domain).toBeInstanceOf(Reproduction);
            expect(domain.id).toBe(id);
            expect(domain.animalId).toBe(animalId);
            expect(domain.reproductiveStatus).toBe(ReproductiveStatus.PREGNANT);
            expect(domain.lastCalvingDate).toBe('2025-05-15');
            expect(domain.offspringCount).toBe(3);
            expect(domain.breedingType).toBe(BreedingType.ARTIFICIAL);
            expect(domain.heatDate).toEqual(heatDate);
            expect(domain.expectedCalvingDate).toEqual(expectedCalvingDate);
            expect(domain.bullId).toBe('CHAMPION-BULL-01');
            expect(domain.semenBatch).toBe('BATCH-2026-B');
            expect(domain.inseminationDetails).toBe('Protocolo IATF completado');
            expect(domain.createdAt).toBe(createdAt);
            expect(domain.updatedAt).toBe(updatedAt);
        });

        it('debería mapear correctamente campos nulos del modelo Sequelize', () => {
            const id = randomUUID();
            const mockModel: any = {
                id,
                animalId,
                reproductiveStatus: ReproductiveStatus.OPEN,
                lastCalvingDate: null,
                offspringCount: 0,
                breedingType: null,
                heatDate: null,
                expectedCalvingDate: null,
                bullId: null,
                semenBatch: null,
                inseminationDetails: null
            };

            const domain = repository.toDomain(mockModel);

            expect(domain.heatDate).toBeNull();
            expect(domain.expectedCalvingDate).toBeNull();
            expect(domain.bullId).toBeNull();
            expect(domain.semenBatch).toBeNull();
            expect(domain.inseminationDetails).toBeNull();
        });
    });

    describe('Entidad Reproduction - Métodos y Reglas de Negocio', () => {
        it('debería calcular la fecha estimada de parto (283 días por defecto para bovinos)', () => {
            const heatDate = new Date('2026-01-01T00:00:00Z');
            const entity = new Reproduction(
                randomUUID(),
                animalId,
                ReproductiveStatus.PREGNANT,
                null,
                0,
                BreedingType.NATURAL,
                heatDate
            );

            const calculated = entity.calculateExpectedCalvingDate();
            expect(calculated).not.toBeNull();
            // 283 días después del 1 de enero de 2026: 283 * 86400000 ms
            const expectedTime = heatDate.getTime() + 283 * 24 * 60 * 60 * 1000;
            expect(entity.expectedCalvingDate?.getTime()).toBe(expectedTime);
        });

        it('debería registrar el celo y la monta mediante métodos de dominio', () => {
            const entity = new Reproduction(
                randomUUID(),
                animalId,
                ReproductiveStatus.EMPTY
            );

            const heat = new Date('2026-03-01T08:00:00Z');
            entity.recordHeat(heat);
            expect(entity.heatDate).toBe(heat);

            entity.recordBreeding(BreedingType.INSEMINATION, {
                bullId: 'BULL-XYZ',
                semenBatch: 'BATCH-001',
                inseminationDetails: 'Inseminado sin novedades'
            });

            expect(entity.breedingType).toBe(BreedingType.INSEMINATION);
            expect(entity.bullId).toBe('BULL-XYZ');
            expect(entity.semenBatch).toBe('BATCH-001');
            expect(entity.inseminationDetails).toBe('Inseminado sin novedades');
            expect(entity.expectedCalvingDate).not.toBeNull();
        });

        it('debería lanzar error si offspringCount es negativo', () => {
            expect(() => {
                new Reproduction(
                    randomUUID(),
                    animalId,
                    ReproductiveStatus.EMPTY,
                    null,
                    -1
                );
            }).toThrow('Offspring count cannot be negative');
        });
    });
});
