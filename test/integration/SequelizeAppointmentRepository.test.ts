import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeAppointmentRepository } from '@infrastructure/database/repositories/SequelizeAppointmentRepository.js';
import { Appointment, AppointmentStatus } from '@domain/entities/Appointment.js';
import { Appointment as AppointmentModel } from '@infrastructure/database/models/Appointment.model.js';
import { Animal as AnimalModel } from '@infrastructure/database/models/Animal.model.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { User as UserModel } from '@infrastructure/database/models/User.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js';

describe('SequelizeAppointmentRepository', () => {
    let repository: SequelizeAppointmentRepository;
    let testAnimalId: string;
    let testUserId: string;

    beforeEach(async () => {
        repository = new SequelizeAppointmentRepository();
        testAnimalId = randomUUID();
        const testOwnerId = randomUUID();
        testUserId = randomUUID();

        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await AppointmentModel.truncate();
        await AnimalModel.truncate();
        await OwnerModel.truncate();
        await UserModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        await UserModel.create({
            id: testUserId,
            username: 'vetuser',
            email: `${randomUUID()}@test.com`,
            password: 'pwd',
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
            species: 'canine',
            animalType: 'urban',
            breed: 'Labrador',
            gender: 'male',
            birthDate: new Date('2020-01-01'),
            status: 'active',
            color: 'Golden',
            ownerId: testOwnerId
        });
    });

    it('should save and find an appointment by id', async () => {
        const id = randomUUID();
        const appointment = new Appointment(id, testAnimalId, new Date(), 'Checkup', AppointmentStatus.SCHEDULED, testUserId);

        await repository.save(appointment);

        const found = await repository.findById(id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(id);
        expect(found?.reason).toBe('Checkup');
    });

    it('should find appointments by animal id', async () => {
        const appointment1 = new Appointment(randomUUID(), testAnimalId, new Date(), 'Checkup 1', AppointmentStatus.SCHEDULED, testUserId);
        const appointment2 = new Appointment(randomUUID(), testAnimalId, new Date(), 'Checkup 2', AppointmentStatus.COMPLETED, testUserId);

        await repository.save(appointment1);
        await repository.save(appointment2);

        const appointments = await repository.findByAnimalId(testAnimalId);
        expect(appointments).toHaveLength(2);
    });

    it('should list all appointments', async () => {
        const appointment = new Appointment(randomUUID(), testAnimalId, new Date(), 'Checkup', AppointmentStatus.SCHEDULED, testUserId);
        await repository.save(appointment);

        const all = await repository.findAll();
        expect(all.length).toBeGreaterThan(0);
    });

    it('should update an appointment', async () => {
        const id = randomUUID();
        const appointment = new Appointment(id, testAnimalId, new Date(), 'Checkup', AppointmentStatus.SCHEDULED, testUserId);
        await repository.save(appointment);

        appointment.complete();
        await repository.update(appointment);

        const updated = await repository.findById(id);
        expect(updated?.status).toBe(AppointmentStatus.COMPLETED);
    });

    it('should delete an appointment', async () => {
        const id = randomUUID();
        const appointment = new Appointment(id, testAnimalId, new Date(), 'Checkup', AppointmentStatus.SCHEDULED, testUserId);
        await repository.save(appointment);

        await repository.delete(id);

        const deleted = await repository.findById(id);
        expect(deleted).toBeNull();
    });
});
