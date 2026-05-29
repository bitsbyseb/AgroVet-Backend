import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeOwnerRepository } from '@infrastructure/database/repositories/SequelizeOwnerRepository.js';
import { Owner, OwnerType } from '@domain/entities/Owner.js';
import { Owner as OwnerModel } from '@infrastructure/database/models/Owner.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js'; // Ensure models are initialized

describe('Repositorio Sequelize de Dueños (SequelizeOwnerRepository)', () => {
    let repository: SequelizeOwnerRepository;

    beforeEach(async () => {
        repository = new SequelizeOwnerRepository();
        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await OwnerModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });

    it('debería registrar y encontrar un dueño por su ID', async () => {
        const id = randomUUID();
        const owner = new Owner(
            id,
            'John Doe',
            randomUUID(),
            '555-1234',
            `${randomUUID()}@example.com`,
            '123 Street',
            OwnerType.URBAN
        );

        await repository.save(owner);

        const foundOwner = await repository.findById(id);

        expect(foundOwner).not.toBeNull();
        expect(foundOwner?.id).toBe(owner.id);
        expect(foundOwner?.name).toBe(owner.name);
    });

    it('debería encontrar un dueño buscando por su número de cédula o documento', async () => {
        const id = randomUUID();
        const document = randomUUID();
        const owner = new Owner(
            id,
            'Jane Doe',
            document,
            '555-5678',
            `${randomUUID()}@example.com`,
            '456 Avenue',
            OwnerType.RURAL
        );

        await repository.save(owner);

        const foundOwner = await repository.findByDocument(document);

        expect(foundOwner).not.toBeNull();
        expect(foundOwner?.id).toBe(owner.id);
    });

    it('debería listar a todos los dueños registrados', async () => {
        const owner1 = new Owner(randomUUID(), 'O1', randomUUID(), 'P1', `${randomUUID()}@e1.com`, 'A1', OwnerType.URBAN);
        const owner2 = new Owner(randomUUID(), 'O2', randomUUID(), 'P2', `${randomUUID()}@e2.com`, 'A2', OwnerType.RURAL);

        await repository.save(owner1);
        await repository.save(owner2);

        const allOwners = await repository.findAll();

        expect(allOwners).toHaveLength(2);
    });

    it('debería actualizar la información de un dueño', async () => {
        const id = randomUUID();
        const owner = new Owner(id, 'Old Name', randomUUID(), 'P3', `${randomUUID()}@e3.com`, 'A3', OwnerType.URBAN);
        await repository.save(owner);

        owner.updateDetails({ name: 'New Name' });
        await repository.update(owner);

        const updatedOwner = await repository.findById(id);
        expect(updatedOwner?.name).toBe('New Name');
    });

    it('debería eliminar a un dueño del sistema', async () => {
        const id = randomUUID();
        const owner = new Owner(id, 'To Delete', randomUUID(), 'P4', `${randomUUID()}@e4.com`, 'A4', OwnerType.URBAN);
        await repository.save(owner);

        await repository.delete(id);

        const deletedOwner = await repository.findById(id);
        expect(deletedOwner).toBeNull();
    });
});
