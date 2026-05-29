import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeProductionDataRepository } from '@infrastructure/database/repositories/SequelizeProductionDataRepository.js';
import { ProductionData, ProductionPurpose } from '@domain/entities/ProductionData.js';
import { ProductionData as ProductionModel } from '@infrastructure/database/models/ProductionData.model.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js';

describe('SequelizeProductionDataRepository', () => {
    let repository: SequelizeProductionDataRepository;
    let testAnimalId: string;

    beforeEach(async () => {
        repository = new SequelizeProductionDataRepository();
        testAnimalId = randomUUID();
        const testOwnerId = randomUUID();

        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await ProductionModel.truncate();
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
            ownerType: 'urban'
        });

        await AnimalModel.create({
            id: testAnimalId,
            name: 'Firulais',
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

    it('should save and find production data by animal id', async () => {
        const id = randomUUID();
        const productionData = new ProductionData(id, testAnimalId, 500, null, ProductionPurpose.MEAT, new Date());

        await repository.save(productionData);

        const found = await repository.findByAnimalId(testAnimalId);
        expect(found).toHaveLength(1);
        expect(found[0].id).toBe(id);
        expect(found[0].purpose).toBe(ProductionPurpose.MEAT);
        expect(parseInt(found[0].weight)).toBe(500);
    });
});
