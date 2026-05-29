import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeAnimalRepository } from '@infrastructure/database/repositories/SequelizeAnimalRepository.js';
import { Animal, animalType, speciesType, Gender, Status } from '@domain/entities/Animal.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { randomUUID } from 'node:crypto';
import { OwnerType } from '@domain/entities/Owner.js';
import '@infrastructure/database/models/index.js'; // Ensure models are initialized


describe('SequelizeAnimalRepository', () => {
    let repository: SequelizeAnimalRepository;
    let testOwnerId: string;

    beforeEach(async () => {
        repository = new SequelizeAnimalRepository();
        testOwnerId = randomUUID();
        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await AnimalModel.truncate();
        await OwnerModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Create a default owner for testing
        await OwnerModel.create({
            id: testOwnerId,
            name: 'Test Owner',
            document: randomUUID(), // Use unique document
            phone: '123',
            email: `${randomUUID()}@test.com`, // Use unique email
            address: 'Addr',
            ownerType: OwnerType.URBAN
        });
    });

    it('should save and find an animal by id', async () => {
        const id = randomUUID();
        const animal = new Animal(
            id,
            'Firulais',
            speciesType.CANINE,
            animalType.URBAN,
            'Labrador',
            Gender.MALE,
            new Date('2020-01-01'),
            Status.ACTIVE,
            'Golden',
            testOwnerId
        );

        await repository.save(animal);

        const foundAnimal = await repository.findById(id);

        expect(foundAnimal).not.toBeNull();
        expect(foundAnimal?.id).toBe(animal.id);
        expect(foundAnimal?.name).toBe(animal.name);
        expect(foundAnimal?.ownerId).toBe(animal.ownerId);
    });

    it('should find animals by owner id', async () => {
        const animal1 = new Animal(randomUUID(), 'N1', speciesType.FELINE, animalType.URBAN, 'B1', Gender.FEMALE, new Date(), Status.ACTIVE, 'C1', testOwnerId);
        const animal2 = new Animal(randomUUID(), 'N2', speciesType.CANINE, animalType.URBAN, 'B2', Gender.MALE, new Date(), Status.ACTIVE, 'C2', testOwnerId);

        await repository.save(animal1);
        await repository.save(animal2);

        const ownerAnimals = await repository.findByOwnerId(testOwnerId);

        expect(ownerAnimals).toHaveLength(2);
    });

    it('should update an animal', async () => {
        const id = randomUUID();
        const animal = new Animal(id, 'Old Name', speciesType.EQUINE, animalType.RURAL, 'B3', Gender.MALE, new Date(), Status.ACTIVE, 'C3', testOwnerId);
        await repository.save(animal);

        animal.updatePhysicalData({ name: 'New Name' });
        await repository.update(animal);

        const updatedAnimal = await repository.findById(id);
        expect(updatedAnimal?.name).toBe('New Name');
    });

    it('should delete an animal', async () => {
        const id = randomUUID();
        const animal = new Animal(id, 'To Delete', speciesType.PIG, animalType.RURAL, 'B4', Gender.FEMALE, new Date(), Status.ACTIVE, 'C4', testOwnerId);
        await repository.save(animal);

        await repository.delete(id);

        const deletedAnimal = await repository.findById(id);
        expect(deletedAnimal).toBeNull();
    });
});
