import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeAlimentationRepository } from '@infrastructure/database/repositories/SequelizeAlimentationRepository.js';
import { Alimentation, weightUnits, frequency } from '@domain/entities/Alimentation.js';
import { Alimentation as AlimentationModel } from '@infrastructure/database/models/Alimentation.model.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { Food as FoodModel } from '@infrastructure/database/models/Food.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js'; // Ensure models are initialized

describe('SequelizeAlimentationRepository', () => {
    let repository: SequelizeAlimentationRepository;
    let testAnimalId: string;
    let testFoodId: string;

    beforeEach(async () => {
        repository = new SequelizeAlimentationRepository();
        testAnimalId = randomUUID();
        const testOwnerId = randomUUID();
        testFoodId = randomUUID();

        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await AlimentationModel.truncate();
        await AnimalModel.truncate();
        await OwnerModel.truncate();
        await FoodModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Create dependencies
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
            species: 'canine',
            animalType: 'urban',
            breed: 'Labrador',
            gender: 'male',
            birthDate: new Date('2020-01-01'),
            status: 'active',
            color: 'Golden',
            ownerId: testOwnerId
        });

        await FoodModel.create({
            foodId: testFoodId,
            name: 'Dog Chow',
            brand: 'Purina',
            nutritionalValue: 'High',
            description:"good for digestion",
            price: 50,
            quantity: 100,
            type:"saludable",
            expirationDate: new Date('2030-01-01')
        });
    });

    it('debería registrar y buscar alimentación por ID de animal', async () => {
        const id = randomUUID();
        const alimentation = new Alimentation(
            id,
            testAnimalId,
            testFoodId,
            500,
            weightUnits.g,
            frequency.daily,
            new Date('2023-01-01'),
            new Date('2023-12-31'),
            'Test observation'
        );

        await repository.save(alimentation);

        const diets = await repository.findByAnimalId(testAnimalId);

        expect(diets).toHaveLength(1);
        expect(diets[0].id).toBe(alimentation.id);
        expect(diets[0].foodId).toBe(alimentation.foodId);
        expect(diets[0].count).toBe(alimentation.count);
        expect(diets[0].unit).toBe(alimentation.unit);
        expect(diets[0].frequency).toBe(alimentation.frequency);
        expect(diets[0].observations).toBe(alimentation.observations);
    });
});
