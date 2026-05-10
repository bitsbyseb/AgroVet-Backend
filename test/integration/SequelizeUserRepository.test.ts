import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeUserRepository } from '@infrastructure/database/repositories/SequelizeUserRepository.js';
import { User, UserRole } from '@domain/entities/User.js';
import { User as UserModel } from '@infrastructure/database/models/User.model.ts';
import { randomUUID } from 'node:crypto';

describe('Repositorio Sequelize de Usuarios (SequelizeUserRepository)', () => {
    let repository: SequelizeUserRepository;

    beforeEach(async () => {
        repository = new SequelizeUserRepository();
        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await UserModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });

    it('debería registrar y buscar un usuario usando su correo electrónico', async () => {
        const id = randomUUID();
        const user = new User({
            id,
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword',
            role: UserRole.ADMIN,
        });

        await repository.save(user);

        const foundUser = await repository.findByEmail('test@example.com');

        expect(foundUser).not.toBeNull();
        expect(foundUser?.id).toBe(user.id);
        expect(foundUser?.username).toBe(user.username);
        expect(foundUser?.email).toBe(user.email);
        expect(foundUser?.role).toBe(user.role);
    });

    it('debería buscar y encontrar un usuario por su ID', async () => {
        const id = randomUUID();
        const user = new User({
            id,
            username: 'anotheruser',
            email: 'another@example.com',
            password: 'hashedpassword',
            role: UserRole.VETERINARIAN,
        });

        await repository.save(user);

        const foundUser = await repository.findById(id);

        expect(foundUser).not.toBeNull();
        expect(foundUser?.id).toBe(user.id);
    });

    it('debería retornar null si el usuario buscado no existe', async () => {
        const foundUser = await repository.findByEmail('nonexistent@example.com');
        expect(foundUser).toBeNull();
    });
});
