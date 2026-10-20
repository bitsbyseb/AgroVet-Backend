import { describe, it, expect } from 'vitest';
import { cleanWhereClause, buildJsonArrayContains } from '@infrastructure/database/utils/whereHelper.js';
import { Op } from '@sequelize/core';

describe('whereHelper Unit Tests', () => {
    describe('cleanWhereClause', () => {
        it('should return an empty object when null or undefined is passed', () => {
            expect(cleanWhereClause(null)).toEqual({});
            expect(cleanWhereClause(undefined)).toEqual({});
        });

        it('should omit undefined, null, and empty string properties', () => {
            const filters = {
                paddockId: 'paddock-123',
                animalId: '',
                status: null,
                category: undefined,
                validEmptySpaces: '   '
            };

            const result = cleanWhereClause(filters);

            expect(result).toEqual({
                paddockId: 'paddock-123'
            });
            expect(result).not.toHaveProperty('animalId');
            expect(result).not.toHaveProperty('status');
            expect(result).not.toHaveProperty('category');
            expect(result).not.toHaveProperty('validEmptySpaces');
        });

        it('should preserve booleans, numbers, and Date objects', () => {
            const date = new Date('2026-03-01T00:00:00.000Z');
            const filters = {
                count: 0,
                active: false,
                recordDate: date
            };

            const result = cleanWhereClause(filters);

            expect(result).toEqual({
                count: 0,
                active: false,
                recordDate: date
            });
        });

        it('should handle nested Sequelize operator objects and clean empty nested keys', () => {
            const startDate = new Date('2026-03-01T00:00:00.000Z');
            const filters = {
                entryDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: undefined
                },
                emptyNested: {
                    [Op.eq]: '',
                    [Op.ne]: null
                }
            };

            const result = cleanWhereClause(filters);

            expect(result).toEqual({
                entryDate: {
                    [Op.gte]: startDate
                }
            });
            expect(result).not.toHaveProperty('emptyNested');
        });

        it('should filter empty items from arrays and omit empty arrays', () => {
            const filters = {
                animalIds: ['uuid-1', '', null, 'uuid-2'],
                emptyArray: ['', null, undefined]
            };

            const result = cleanWhereClause(filters);

            expect(result).toEqual({
                animalIds: ['uuid-1', 'uuid-2']
            });
            expect(result).not.toHaveProperty('emptyArray');
        });
    });

    describe('buildJsonArrayContains', () => {
        it('should return Op.substring with the target animalId value', () => {
            const animalId = '123e4567-e89b-12d3-a456-426614174000';
            const condition = buildJsonArrayContains(animalId);

            expect(condition).toEqual({
                [Op.substring]: animalId
            });
        });
    });
});
