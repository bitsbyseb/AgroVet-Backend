import { describe, it, expect, beforeEach } from 'vitest';
import { SequelizeFoodRepository } from '@infrastructure/database/repositories/SequelizeFoodRepository.js';
import { Food } from '@domain/entities/Food.js';
import { Food as FoodModel } from '@infrastructure/database/models/Food.model.js';
import { randomUUID } from 'node:crypto';
import '@infrastructure/database/models/index.js';

describe('SequelizeFoodRepository', () => {
    let repository: SequelizeFoodRepository;

    beforeEach(async () => {
        repository = new SequelizeFoodRepository();
        const { sequelize } = await import('@infrastructure/database/config/db.config.js');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await FoodModel.truncate();
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });

    it('should save and find food by id', async () => {
        const id = randomUUID();
        const food = new Food(id, 'Pedigree', 'Dry', 'Good food');

        await repository.save(food);

        const found = await repository.findById(id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(id);
        expect(found?.name).toBe('Pedigree');
    });

    it('should list all foods', async () => {
        const food1 = new Food(randomUUID(), 'Pedigree', 'Dry', 'Good food');
        const food2 = new Food(randomUUID(), 'Dog Chow', 'Wet', 'Tasty');

        await repository.save(food1);
        await repository.save(food2);

        const all = await repository.findAll();
        expect(all).toHaveLength(2);
    });
});
