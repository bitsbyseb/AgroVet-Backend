import { describe, it, expect } from 'vitest';
import { GrazingActivity } from '@domain/entities/GrazingActivity.js';
import { randomUUID } from 'node:crypto';

describe('GrazingActivity Domain Entity Unit Tests', () => {
    const validPaddockId = randomUUID();
    const validAnimalId1 = randomUUID();
    const validAnimalId2 = randomUUID();
    const entryDate = new Date('2026-03-01T08:00:00Z');
    const exitDate = new Date('2026-03-05T17:00:00Z');

    it('should successfully create a GrazingActivity entity with valid data', () => {
        const id = randomUUID();
        const activity = new GrazingActivity(
            id,
            validPaddockId,
            [validAnimalId1, validAnimalId2],
            entryDate,
            exitDate,
            2,
            'Rotación regular con buen forraje'
        );

        expect(activity.id).toBe(id);
        expect(activity.paddockId).toBe(validPaddockId);
        expect(activity.animalIds).toHaveLength(2);
        expect(activity.entryDate).toEqual(entryDate);
        expect(activity.exitDate).toEqual(exitDate);
        expect(activity.rotationNumber).toBe(2);
        expect(activity.observations).toBe('Rotación regular con buen forraje');
        expect(activity.isActive()).toBe(false);
        expect(activity.isCompleted()).toBe(true);
        expect(activity.getAnimalCount()).toBe(2);
    });

    it('should create an active GrazingActivity when exitDate is null', () => {
        const id = randomUUID();
        const activity = new GrazingActivity(
            id,
            validPaddockId,
            [validAnimalId1],
            entryDate,
            null,
            1
        );

        expect(activity.isActive()).toBe(true);
        expect(activity.isCompleted()).toBe(false);
        expect(activity.exitDate).toBeNull();
    });

    it('should throw error when paddockId is empty or blank', () => {
        expect(() => new GrazingActivity(
            randomUUID(),
            '',
            [validAnimalId1],
            entryDate
        )).toThrow('Paddock ID cannot be empty');
    });

    it('should throw error when rotationNumber is less than 1 or not integer', () => {
        expect(() => new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate,
            null,
            0
        )).toThrow('Rotation number must be a positive integer greater than or equal to 1');

        expect(() => new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate,
            null,
            1.5
        )).toThrow('Rotation number must be a positive integer greater than or equal to 1');
    });

    it('should throw error when exitDate is earlier than entryDate', () => {
        const invalidExitDate = new Date('2026-02-28T08:00:00Z');
        expect(() => new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate,
            invalidExitDate,
            1
        )).toThrow('Exit date cannot be earlier than entry date');
    });

    it('should properly record exit of animals', () => {
        const activity = new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate,
            null,
            1
        );

        expect(activity.isActive()).toBe(true);
        activity.recordExit(exitDate, 'Salida sin novedades');
        expect(activity.isActive()).toBe(false);
        expect(activity.isCompleted()).toBe(true);
        expect(activity.exitDate).toEqual(exitDate);
        expect(activity.observations).toBe('Salida sin novedades');
    });

    it('should throw error when recording exit with date earlier than entry', () => {
        const activity = new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate,
            null,
            1
        );

        const invalidExitDate = new Date('2026-02-20T08:00:00Z');
        expect(() => activity.recordExit(invalidExitDate)).toThrow('Exit date cannot be earlier than entry date');
    });

    it('should add and remove animals from the grazing activity', () => {
        const activity = new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate
        );

        expect(activity.getAnimalCount()).toBe(1);

        activity.addAnimal(validAnimalId2);
        expect(activity.getAnimalCount()).toBe(2);
        expect(activity.animalIds).toContain(validAnimalId2);

        // Duplicates should not be added
        activity.addAnimal(validAnimalId2);
        expect(activity.getAnimalCount()).toBe(2);

        activity.removeAnimal(validAnimalId1);
        expect(activity.getAnimalCount()).toBe(1);
        expect(activity.animalIds).not.toContain(validAnimalId1);
    });

    it('should update details with validation', () => {
        const activity = new GrazingActivity(
            randomUUID(),
            validPaddockId,
            [validAnimalId1],
            entryDate,
            null,
            1
        );

        activity.updateDetails({
            rotationNumber: 3,
            observations: 'Pastoreo intensivo'
        });

        expect(activity.rotationNumber).toBe(3);
        expect(activity.observations).toBe('Pastoreo intensivo');
    });
});
