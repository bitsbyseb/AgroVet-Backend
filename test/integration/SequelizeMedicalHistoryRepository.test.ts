import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { SequelizeMedicalHistoryRepository } from '@infrastructure/database/repositories/SequelizeMedicalHistoryRepository.js';
import { MedicalHistory } from '@domain/entities/MedicalHistory.js';
import { MedicalHistory as MedicalHistoryModel } from '@infrastructure/database/models/MedicalHistory.model.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { User as UserModel } from '@infrastructure/database/models/User.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js'; // Ensure models are initialized

describe('Repositorio Sequelize de Historial Médico (SequelizeMedicalHistoryRepository)', () => {
    let repository: SequelizeMedicalHistoryRepository;
    let testAnimalId: string;
    let testOwnerId: string;
    let testUserId: string;

    beforeEach(async () => {
        repository = new SequelizeMedicalHistoryRepository();
        testAnimalId = randomUUID();
        testOwnerId = randomUUID();
        testUserId = randomUUID(); // simulates a veterinarian ID
        
        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await MedicalHistoryModel.truncate();
        await AnimalModel.truncate();
        await OwnerModel.truncate();
        await UserModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Create dependencies
        await UserModel.create({
            id: testUserId,
            username: 'testvet',
            email: `${randomUUID()}@test.com`,
            password: 'hashedpwd',
            role: 'veterinarian' as any
        });

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
            species: 'canine' as any,
            animalType: 'urban' as any,
            breed: 'Labrador',
            gender: 'male' as any,
            birthDate: new Date('2020-01-01'),
            status: 'active' as any,
            color: 'Golden',
            ownerId: testOwnerId
        });
    });

    it('debería registrar y buscar un historial médico por su ID', async () => {
        const id = randomUUID();
        const history = new MedicalHistory(
            id,
            testAnimalId,
            new Date('2023-10-01T10:00:00Z'),
            'Decaimiento general',
            'Infección viral',
            'Antibióticos por 5 días',
            'Observar evolución',
            testUserId
        );

        await repository.save(history);

        const foundHistory = await repository.findById(id);

        expect(foundHistory).not.toBeNull();
        expect(foundHistory?.id).toBe(history.id);
        expect(foundHistory?.animalId).toBe(history.animalId);
        expect(foundHistory?.diagnosis).toBe(history.diagnosis);
        expect(foundHistory?.treatment).toBe(history.treatment);
        expect(foundHistory?.createdBy).toBe(history.createdBy);
    });

    it('debería encontrar los historiales médicos de un animal en específico', async () => {
        const history1 = new MedicalHistory(randomUUID(), testAnimalId, new Date(), 'R1', 'D1', 'T1', 'O1', testUserId);
        const history2 = new MedicalHistory(randomUUID(), testAnimalId, new Date(), 'R2', 'D2', 'T2', 'O2', testUserId);

        await repository.save(history1);
        await repository.save(history2);

        const animalHistory = await repository.findByAnimalId(testAnimalId);

        expect(animalHistory).toHaveLength(2);
    });

    it('debería actualizar los datos de un historial médico', async () => {
        const id = randomUUID();
        const history = new MedicalHistory(id, testAnimalId, new Date(), 'R', 'D', 'T', 'O', testUserId);
        await repository.save(history);

        history.update({ diagnosis: 'Diagnóstico Actualizado', treatment: 'Nuevo Tratamiento' });
        await repository.update(history);

        const updatedHistory = await repository.findById(id);
        expect(updatedHistory?.diagnosis).toBe('Diagnóstico Actualizado');
        expect(updatedHistory?.treatment).toBe('Nuevo Tratamiento');
        expect(updatedHistory?.reason).toBe('R'); // remains unchanged
    });

    it('debería eliminar el registro de un historial médico', async () => {
        const id = randomUUID();
        const history = new MedicalHistory(id, testAnimalId, new Date(), 'R', 'D', 'T', 'O', testUserId);
        await repository.save(history);

        await repository.delete(id);

        const deletedHistory = await repository.findById(id);
        expect(deletedHistory).toBeNull();
    });
});
