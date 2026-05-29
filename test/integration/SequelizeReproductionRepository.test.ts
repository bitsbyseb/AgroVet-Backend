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

    it('should save and find reproduction data by animal id', async () => {
        const id = randomUUID();
        const reproduction = new Reproduction(id, testAnimalId, ReproductiveStatus.PREGNANT, '2023-01-01', 1, BreedingType.NATURAL);

        await repository.save(reproduction);

        const found = await repository.findByAnimalId(testAnimalId);
        expect(found).toHaveLength(1);
        expect(found[0].id).toBe(id);
        expect(found[0].reproductiveStatus).toBe(ReproductiveStatus.PREGNANT);
        expect(found[0].offspringCount).toBe(1);
    });
});
