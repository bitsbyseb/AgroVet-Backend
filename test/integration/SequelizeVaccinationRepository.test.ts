import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeVaccinationRepository } from '@infrastructure/database/repositories/SequelizeVaccinationRepository.js';
import { Vaccination } from '@domain/entities/Vaccination.js';
import { Vaccination as VaccinationModel } from '@infrastructure/database/models/Vaccination.model.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { User as UserModel, UserRole } from '@infrastructure/database/models/User.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js';

describe('SequelizeVaccinationRepository', () => {
    let repository: SequelizeVaccinationRepository;
    let testAnimalId: string;
    let testUserId: string;

    beforeEach(async () => {
        repository = new SequelizeVaccinationRepository();
        testAnimalId = randomUUID();
        const testOwnerId = randomUUID();

        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await VaccinationModel.truncate();
        await AnimalModel.truncate();
        await OwnerModel.truncate();
        await UserModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        testUserId = randomUUID();
        await UserModel.create({
            id: testUserId,
            username: 'testuser',
            email: `${randomUUID()}@test.com`,
            password: 'hashedpassword',
            role: UserRole.VETERINARIAN
        });

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

    it('should save and find vaccination data by id', async () => {
        const id = randomUUID();
        const vaccination = new Vaccination(id, testAnimalId, 'Rabies', new Date(), null, 'B123', testUserId);

        await repository.save(vaccination);

        const found = await repository.findById(id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(id);
        expect(found?.vaccineName).toBe('Rabies');
    });

    it('should find vaccinations by animal id', async () => {
        const vaccination = new Vaccination(randomUUID(), testAnimalId, 'Rabies', new Date(), null, 'B123', testUserId);
        await repository.save(vaccination);

        const found = await repository.findByAnimalId(testAnimalId);
        expect(found).toHaveLength(1);
    });

    it('should list all vaccinations', async () => {
        const vaccination = new Vaccination(randomUUID(), testAnimalId, 'Rabies', new Date(), null, 'B123', testUserId);
        await repository.save(vaccination);

        const all = await repository.findAll();
        expect(all.length).toBeGreaterThan(0);
    });

    it('should update vaccination', async () => {
        const id = randomUUID();
        const vaccination = new Vaccination(id, testAnimalId, 'Rabies', new Date(), null, 'B123', testUserId);
        await repository.save(vaccination);

        vaccination.update({ vaccineName: 'New Rabies' });
        await repository.update(vaccination);

        const updated = await repository.findById(id);
        expect(updated?.vaccineName).toBe('New Rabies');
    });

    it('should delete vaccination', async () => {
        const id = randomUUID();
        const vaccination = new Vaccination(id, testAnimalId, 'Rabies', new Date(), null, 'B123', testUserId);
        await repository.save(vaccination);

        await repository.delete(id);

        const deleted = await repository.findById(id);
        expect(deleted).toBeNull();
    });
});
