import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeReproductionRepository } from '@infrastructure/database/repositories/SequelizeReproductionRepository.js';
import { Reproduction, ReproductiveStatus, BreedingType } from '@domain/entities/Reproduction.js';
import { ReproductionData as ReproductionModel } from '@infrastructure/database/models/Reproduction.model.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js';

describe('SequelizeReproductionRepository', () => {
    let repository: SequelizeReproductionRepository;
    let testAnimalId: string;

    beforeEach(async () => {
        repository = new SequelizeReproductionRepository();
        testAnimalId = randomUUID();
        const testOwnerId = randomUUID();

        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await ReproductionModel.truncate();
        await AnimalModel.truncate();
        await OwnerModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        await OwnerModel.create({
            id: testOwnerId,
            name: 'Test Owner',
            document: randomUUID(),
            phone: '123',
            email: `${randomUUID()}@test.com`,
            address: 'Addr',
            ownerType: 'rural'
        });

        await AnimalModel.create({
            id: testAnimalId,
            name: 'Bessie',
            species: 'bovine',
            animalType: 'rural',
            breed: 'Angus',
            gender: 'female',
            birthDate: new Date('2020-01-01'),
            status: 'active',
            color: 'Black',
            ownerId: testOwnerId
        });
    });

    it('should save and find reproduction data by animal id with extended fields', async () => {
        const id = randomUUID();
        const heatDate = new Date('2026-05-10T08:00:00Z');
        const expectedCalvingDate = new Date('2027-02-17T08:00:00Z');

        const reproduction = new Reproduction(
            id,
            testAnimalId,
            ReproductiveStatus.PREGNANT,
            '2023-01-01',
            1,
            BreedingType.INSEMINATION,
            heatDate,
            expectedCalvingDate,
            'TORO-098',
            'SEMEN-LOTE-2026',
            'Inseminación artificial exitosa'
        );

        await repository.save(reproduction);

        const found = await repository.findByAnimalId(testAnimalId);
        expect(found).toHaveLength(1);
        expect(found[0].id).toBe(id);
        expect(found[0].reproductiveStatus).toBe(ReproductiveStatus.PREGNANT);
        expect(found[0].offspringCount).toBe(1);
        expect(found[0].breedingType).toBe(BreedingType.INSEMINATION);
        expect(found[0].bullId).toBe('TORO-098');
        expect(found[0].semenBatch).toBe('SEMEN-LOTE-2026');
        expect(found[0].inseminationDetails).toBe('Inseminación artificial exitosa');
        expect(found[0].heatDate).not.toBeNull();
        expect(found[0].expectedCalvingDate).not.toBeNull();
    });

    it('should find by id, update and delete reproduction records', async () => {
        const id = randomUUID();
        const reproduction = new Reproduction(
            id,
            testAnimalId,
            ReproductiveStatus.EMPTY,
            null,
            0,
            BreedingType.NATURAL
        );

        await repository.save(reproduction);

        const byId = await repository.findById(id);
        expect(byId).not.toBeNull();
        expect(byId?.id).toBe(id);

        byId?.update({
            reproductiveStatus: ReproductiveStatus.PREGNANT,
            bullId: 'BULL-NEW'
        });
        await repository.update(byId!);

        const updated = await repository.findById(id);
        expect(updated?.reproductiveStatus).toBe(ReproductiveStatus.PREGNANT);
        expect(updated?.bullId).toBe('BULL-NEW');

        await repository.delete(id);
        const deleted = await repository.findById(id);
        expect(deleted).toBeNull();
    });
});
